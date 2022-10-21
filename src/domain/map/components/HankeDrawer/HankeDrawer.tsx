import React, { useState, useEffect } from 'react';
import GeoJSON from 'ol/format/GeoJSON';
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

import { HankeGeoJSON } from '../../../../common/types/hanke';
import Kantakartta from '../Layers/Kantakartta';
import Ortokartta from '../Layers/Ortokartta';

import styles from '../../Map.module.scss';
import hankeDrawerStyles from './HankeDrawer.module.scss';
import { useMapDataLayers } from '../../hooks/useMapLayers';
import { formatFeaturesToHankeGeoJSON } from '../../utils';
import { MapTileLayerId } from '../../types';
import AddressSearchContainer from '../AddressSearch/AddressSearchContainer';
import OverviewMapControl from '../../../../common/components/map/controls/OverviewMapControl';
import ControlPanel from '../../../../common/components/map/controls/ControlPanel';
import DateRangeControl from '../../../../common/components/map/controls/DateRangeControl';
import { useDateRangeFilter } from '../../hooks/useDateRangeFilter';

type Props = {
  geometry: HankeGeoJSON | undefined;
  onAddFeature?: (feature: Feature<Geometry>) => void;
  onChangeFeature?: (feature: Feature<Geometry>) => void;
  onRemoveFeature?: (feature: Feature<Geometry>) => void;
  center?: Coordinate;
  drawSource?: VectorSource;
  zoom?: number;
};

const HankeDrawer: React.FC<Props> = ({
  onAddFeature,
  onChangeFeature,
  onRemoveFeature,
  geometry,
  center,
  drawSource: existingDrawSource,
  zoom = 9,
}) => {
  const { mapTileLayers, toggleMapTileLayer, handleUpdateGeometryState } = useMapDataLayers();
  const [drawSource] = useState<VectorSource>(existingDrawSource || new VectorSource());

  const {
    hankeFilterStartDate,
    hankeFilterEndDate,
    setHankeFilterStartDate,
    setHankeFilterEndDate,
  } = useDateRangeFilter();

  useEffect(() => {
    if (geometry && geometry.features.length > 0) {
      drawSource.addFeatures(new GeoJSON().readFeatures(geometry));
      drawSource.dispatchEvent('featuresAdded');
    }
  }, [geometry, drawSource]);

  useEffect(() => {
    const updateState = () => {
      const drawGeometry = formatFeaturesToHankeGeoJSON(drawSource.getFeatures());
      handleUpdateGeometryState(drawGeometry);
    };

    function handleAddFeature(e: VectorSourceEvent<Geometry>) {
      if (onAddFeature) {
        onAddFeature(e.feature);
      }
      updateState();
    }

    const handleChangeFeature = debounce((e: VectorSourceEvent<Geometry>) => {
      if (onChangeFeature) {
        onChangeFeature(e.feature);
      }
      updateState();
    }, 100);

    function handleRemoveFeature(e: VectorSourceEvent<Geometry>) {
      if (onRemoveFeature) {
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

          <Controls>
            <DrawModule source={drawSource} />
            <ControlPanel className={hankeDrawerStyles.dateRangeControl}>
              <DateRangeControl
                startDate={hankeFilterStartDate}
                updateStartDate={setHankeFilterStartDate}
                endDate={hankeFilterEndDate}
                updateEndDate={setHankeFilterEndDate}
              />
            </ControlPanel>
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
