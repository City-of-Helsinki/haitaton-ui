import React from 'react';
import VectorSource from 'ol/source/Vector';
import Map from '../../../../common/components/map/Map';
import Kantakartta from '../Layers/Kantakartta';
import OverviewMapControl from '../../../../common/components/map/controls/OverviewMapControl';
import { HankeAlue } from '../../../types/hanke';
import styles from './HankealueMap.module.scss';
import VectorLayer from '../../../../common/components/map/layers/VectorLayer';
import FitSource from '../interations/FitSource';
import useHankealueFeature from '../../hooks/useHankealueFeature';
import AddressSearchContainer from '../AddressSearch/AddressSearchContainer';
import Ortokartta from '../Layers/Ortokartta';
import Controls from '../../../../common/components/map/controls/Controls';
import LayerControl from '../../../../common/components/map/controls/LayerControl';
import { MapTileLayerId } from '../../types';
import { Coordinate } from 'ol/coordinate';
import { useMapDataLayers } from '../../hooks/useMapLayers';
import { styleFunction } from '../../utils/geometryStyle';

type Props = {
  hankealue: HankeAlue;
  index: number;
  center?: Coordinate;
  drawSource?: VectorSource;
  zoom?: number;
};

const HankealueMap: React.FC<Props> = ({
  hankealue,
  index,
  center,
  drawSource: existingDrawSource,
  zoom = 9,
}) => {
  const { mapTileLayers, toggleMapTileLayer } = useMapDataLayers();
  const ortoLayerOpacity = mapTileLayers.kantakartta.visible ? 0.5 : 1;
  const drawSource = existingDrawSource || new VectorSource();
  useHankealueFeature(drawSource, hankealue, index);

  return (
    <>
      <div
        className={`${styles.mapContainer} ${styles.borders}`}
        style={{ width: '100%', height: 500 }}
      >
        <Map zoom={zoom} center={center} mapClassName={styles.mapContainer__inner}>
          <AddressSearchContainer position={{ top: '1rem', left: '1rem' }} zIndex={1000} />

          <OverviewMapControl />

          {mapTileLayers.kantakartta.visible && <Kantakartta />}
          {mapTileLayers.ortokartta.visible && <Ortokartta opacity={ortoLayerOpacity} />}
          <VectorLayer
            source={drawSource}
            zIndex={100}
            className="drawLayer"
            style={styleFunction}
          />

          <FitSource source={drawSource} />

          <Controls>
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

export default HankealueMap;
