import React, { useState, useEffect, useCallback } from 'react';
import { Vector as VectorSource } from 'ol/source';
import { VectorSourceEvent } from 'ol/source/Vector';
import { Feature } from 'ol';
import Geometry from 'ol/geom/Geometry';
import { Coordinate } from 'ol/coordinate';
import { FeatureLike } from 'ol/Feature';
import { debounce, isEqual } from 'lodash';
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
import { styleFunction } from '../../utils/geometryStyle';
import HakemusLayer from '../Layers/HakemusLayer';
import { HankkeenHakemus } from '../../../application/types/application';
import { ModifyEvent } from 'ol/interaction/Modify';
import { getWorkAreasInsideHankealueFeature } from '../../../hanke/edit/utils';

type Props = {
  features: Array<Feature | undefined> | undefined;
  onAddFeature?: (feature: Feature<Geometry>) => void;
  onChangeFeature?: (feature: Feature<Geometry>) => void;
  onRemoveFeature?: (feature: Feature<Geometry>) => void;
  center?: Coordinate;
  drawSource?: VectorSource;
  hankkeenHakemukset: HankkeenHakemus[];
  restrictDrawingToHakemusAreas?: boolean;
  zoom?: number;
};

const HankeDrawer: React.FC<React.PropsWithChildren<Props>> = ({
  onAddFeature,
  onChangeFeature,
  onRemoveFeature,
  features,
  center,
  drawSource: existingDrawSource,
  hankkeenHakemukset,
  restrictDrawingToHakemusAreas = false,
  zoom = 9,
}) => {
  const { mapTileLayers, toggleMapTileLayer, handleUpdateGeometryState } = useMapDataLayers();
  const ortoLayerOpacity = mapTileLayers.kantakartta.visible ? 0.5 : 1;
  const [drawSource] = useState<VectorSource>(existingDrawSource || new VectorSource());

  // Draw existing features
  useEffect(() => {
    if (features && features.length > 0) {
      drawSource.clear();
      features.forEach((feature) => {
        if (feature) {
          drawSource.addFeature(feature);
        }
      });
      drawSource.dispatchEvent('featuresAdded');
    }
  }, [features, drawSource]);

  useEffect(() => {
    const updateState = () => {
      const drawGeometry = formatFeaturesToHankeGeoJSON(drawSource.getFeatures());
      handleUpdateGeometryState(drawGeometry);
    };

    function handleAddFeature(e: VectorSourceEvent<FeatureLike>) {
      if (onAddFeature && e.feature) {
        onAddFeature(e.feature as Feature<Geometry>);
      }
      updateState();
    }

    const handleChangeFeature = debounce((e: VectorSourceEvent<FeatureLike>) => {
      if (onChangeFeature && e.feature) {
        onChangeFeature(e.feature as Feature<Geometry>);
      }
      updateState();
    }, 100);

    function handleRemoveFeature(e: VectorSourceEvent<FeatureLike>) {
      if (onRemoveFeature && e.feature) {
        onRemoveFeature(e.feature as Feature<Geometry>);
      }
      updateState();
    }

    drawSource.on('addfeature', handleAddFeature);
    drawSource.on('changefeature', handleChangeFeature);
    drawSource.on('removefeature', handleRemoveFeature);

    return function cleanUp() {
      handleChangeFeature.cancel();
      drawSource.un('addfeature', handleAddFeature);
      drawSource.un('changefeature', handleChangeFeature);
      drawSource.un('removefeature', handleRemoveFeature);
    };
  }, [drawSource, handleUpdateGeometryState, onAddFeature, onChangeFeature, onRemoveFeature]);

  const handleModifyEnd = useCallback(
    (_event: ModifyEvent, originalFeature: Feature | null, modifiedFeature: Feature) => {
      if (!originalFeature) {
        return;
      }
      const workAreasInsideOriginalHankealueFeature = getWorkAreasInsideHankealueFeature(
        formatFeaturesToHankeGeoJSON([originalFeature]).features[0],
        hankkeenHakemukset,
      );
      const workAreasInsideModifiedHankealueFeature = getWorkAreasInsideHankealueFeature(
        formatFeaturesToHankeGeoJSON([modifiedFeature]).features[0],
        hankkeenHakemukset,
      );
      if (
        !isEqual(workAreasInsideModifiedHankealueFeature, workAreasInsideOriginalHankealueFeature)
      ) {
        // If original hankealue feature has different work area features than modified feature,
        // revert back to original geometry
        modifiedFeature.setGeometry(originalFeature.getGeometry());
      }
    },
    [hankkeenHakemukset],
  );

  return (
    <>
      <div
        className={`${styles.mapContainer} ${styles.borders}`}
        style={{ width: '100%', height: 500 }}
      >
        <Map
          zoom={zoom}
          center={center}
          mapClassName={styles.mapContainer__inner}
          showAttribution={false}
        >
          <AddressSearchContainer position={{ top: '1rem', left: '1rem' }} zIndex={1000} />

          <OverviewMapControl className={hankeDrawerStyles.overviewMap} />

          {mapTileLayers.kantakartta.visible && <Kantakartta />}
          {mapTileLayers.ortokartta.visible && <Ortokartta opacity={ortoLayerOpacity} />}
          <VectorLayer source={drawSource} zIndex={0} className="drawLayer" style={styleFunction} />

          {hankkeenHakemukset?.map((hakemus) => (
            <HakemusLayer key={hakemus.id} hakemusId={hakemus.id!} layerStyle={styleFunction} />
          ))}

          <FitSource source={drawSource} />

          <Controls>
            <DrawModule
              handleModifyEnd={restrictDrawingToHakemusAreas ? handleModifyEnd : undefined}
            />
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
