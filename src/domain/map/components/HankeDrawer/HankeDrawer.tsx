import React, { useState, useEffect } from 'react';
import GeoJSON from 'ol/format/GeoJSON';
import { Vector as VectorSource } from 'ol/source';
import Map from '../../../../common/components/map/Map';
import Controls from '../../../../common/components/map/controls/Controls';
import LayerControl from '../../../../common/components/map/controls/LayerControl';
import VectorLayer from '../../../../common/components/map/layers/VectorLayer';
import DrawModule from '../../../../common/components/map/modules/draw/DrawModule';

import { HankeGeoJSON } from '../../../../common/types/hanke';
import Kantakartta from '../Layers/Kantakartta';
import Ortokartta from '../Layers/Ortokartta';
import FitSource from '../interations/FitSource';

import styles from '../../Map.module.scss';
import { useMapDataLayers } from '../../hooks/useMapLayers';
import { formatFeaturesToHankeGeoJSON } from '../../utils';
import { MapTileLayerId } from '../../types';

type Props = {
  geometry: HankeGeoJSON | undefined;
  onChangeGeometries: () => void;
};

const HankeDrawer: React.FC<Props> = ({ onChangeGeometries, geometry }) => {
  const { mapTileLayers, toggleMapTileLayer, handleUpdateGeometryState } = useMapDataLayers();
  const [drawSource] = useState<VectorSource>(new VectorSource());
  const [zoom] = useState(9); // TODO: also take zoom into consideration

  useEffect(() => {
    if (geometry && geometry.features.length > 0) {
      drawSource.addFeatures(new GeoJSON().readFeatures(geometry));
      drawSource.dispatchEvent('featuresAdded');
    }
  }, [geometry]);

  useEffect(() => {
    const updateState = () => {
      const drawGeometry = formatFeaturesToHankeGeoJSON(drawSource.getFeatures());
      handleUpdateGeometryState(drawGeometry);
    };

    drawSource.on('addfeature', () => updateState());
    drawSource.on('removefeature', () => updateState());
    drawSource.on('changefeature', () => updateState());
    drawSource.on('change', () => {
      onChangeGeometries();
    });
  }, []);

  return (
    <>
      <div className={styles.mapContainer} style={{ width: '100%', height: 500 }}>
        <Map zoom={zoom} mapClassName={styles.mapContainer__inner}>
          {mapTileLayers.kantakartta.visible && <Kantakartta />}
          {mapTileLayers.ortokartta.visible && <Ortokartta />}
          <VectorLayer source={drawSource} zIndex={100} className="drawLayer" />

          <FitSource source={drawSource} />

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
