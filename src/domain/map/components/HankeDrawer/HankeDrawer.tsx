import React, { useState, useEffect, useRef } from 'react';
import { Vector as VectorSource } from 'ol/source';
import { VectorSourceEvent } from 'ol/source/Vector';
import { Feature } from 'ol';
import Geometry from 'ol/geom/Geometry';
import { Coordinate } from 'ol/coordinate';
import { debounce } from 'lodash';
import Map from '../../../../common/components/map/Map';
import Controls from '../../../../common/components/map/controls/Controls';
import LayerControl from '../../../../common/components/map/controls/LayerControl';
import VectorLayer from '../../../../common/components/map/layers/VectorLayer';
import DrawModule from '../../../../common/components/map/modules/draw/DrawModule';

import Kantakartta from '../Layers/Kantakartta';
import Ortokartta from '../Layers/Ortokartta';

import styles from '../../Map.module.scss';
import hankeDrawerStyles from './HankeDrawer.module.scss';
import { useMapDataLayers } from '../../hooks/useMapLayers';
import { formatFeaturesToHankeGeoJSON } from '../../utils';
import { MapTileLayerId } from '../../types';
import AddressSearchContainer from '../AddressSearch/AddressSearchContainer';
import OverviewMapControl from '../../../../common/components/map/controls/OverviewMapControl';
import FitSource from '../interations/FitSource';

type Props = {
  features: Array<Feature | undefined> | undefined;
  onAddFeature?: (feature: Feature<Geometry>) => void;
  onChangeFeature?: (feature: Feature<Geometry>) => void;
  onRemoveFeature?: (feature: Feature<Geometry>) => void;
  center?: Coordinate;
  drawSource?: VectorSource;
  zoom?: number;
};

const HankeDrawer: React.FC<React.PropsWithChildren<Props>> = ({
  onAddFeature,
  onChangeFeature,
  onRemoveFeature,
  features,
  center,
  drawSource: existingDrawSource,
  zoom = 9,
}) => {
  const { mapTileLayers, toggleMapTileLayer, handleUpdateGeometryState } = useMapDataLayers();
  const [drawSource] = useState<VectorSource>(existingDrawSource || new VectorSource());

  const featuresLoaded = useRef(false);

  // Draw existing features once if any
  useEffect(() => {
    if (features && features.length > 0 && !featuresLoaded.current) {
      features.forEach((feature) => {
        if (feature) {
          drawSource.addFeature(feature);
        }
      });
      drawSource.dispatchEvent('featuresAdded');
    }
    featuresLoaded.current = true;
  }, [features, drawSource]);

  useEffect(() => {
    const updateState = () => {
      const drawGeometry = formatFeaturesToHankeGeoJSON(drawSource.getFeatures());
      handleUpdateGeometryState(drawGeometry);
    };

    function handleAddFeature(e: VectorSourceEvent<Geometry>) {
      if (onAddFeature && e.feature) {
        onAddFeature(e.feature);
      }
      updateState();
    }

    const handleChangeFeature = debounce((e: VectorSourceEvent<Geometry>) => {
      if (onChangeFeature && e.feature) {
        onChangeFeature(e.feature);
      }
      updateState();
    }, 100);

    function handleRemoveFeature(e: VectorSourceEvent<Geometry>) {
      if (onRemoveFeature && e.feature) {
        onRemoveFeature(e.feature);
      }
      updateState();
    }

    drawSource.on('addfeature', handleAddFeature);
    drawSource.on('changefeature', handleChangeFeature);
    drawSource.on('removefeature', handleRemoveFeature);

    return function cleanUp() {
      drawSource.un('addfeature', handleAddFeature);
      drawSource.un('changefeature', handleChangeFeature);
      drawSource.un('removefeature', handleRemoveFeature);
    };
  }, [drawSource, handleUpdateGeometryState, onAddFeature, onChangeFeature, onRemoveFeature]);

  return (
    <>
      <div
        className={`${styles.mapContainer} ${styles.borders}`}
        style={{ width: '100%', height: 500 }}
      >
        <Map zoom={zoom} center={center} mapClassName={styles.mapContainer__inner}>
          <AddressSearchContainer position={{ top: '1rem', left: '1rem' }} zIndex={1000} />

          <OverviewMapControl className={hankeDrawerStyles.overviewMap} />

          {mapTileLayers.kantakartta.visible && <Kantakartta />}
          {mapTileLayers.ortokartta.visible && <Ortokartta />}
          <VectorLayer source={drawSource} zIndex={100} className="drawLayer" />

          {featuresLoaded.current && <FitSource source={drawSource} />}

          <Controls>
            <DrawModule source={drawSource} />
            <LayerControl
              tileLayers={Object.values(mapTileLayers)}
              onClickTileLayer={(id: MapTileLayerId) => toggleMapTileLayer(id)}
            />
          </Controls>
        </Map>
      </div>
    </>
  );
};

export default HankeDrawer;
