import React, { useEffect, useRef, useState } from 'react';
import GeoJSON from 'ol/format/GeoJSON';
import { Vector as VectorSource } from 'ol/source';
import { Style, Fill, Stroke } from 'ol/style';
import Map from '../../common/components/map/Map';
import Controls from '../../common/components/map/controls/Controls';
import LayerControl from '../../common/components/map/controls/LayerControl';
import DateRangeControl from '../../common/components/map/controls/DateRangeControl';
import VectorLayer from '../../common/components/map/layers/VectorLayer';
import Kantakartta from './components/Layers/Kantakartta';
import DataLayers from './components/Layers/DataLayers';
import Ortokartta from './components/Layers/Ortokartta';
import HankeSidebar from './components/HankeSidebar/HankeSidebarContainer';
import styles from './Map.module.scss';
import { byAllHankeFilters } from './utils';
import { useMapDataLayers } from './hooks/useMapLayers';
import { useDateRangeFilter } from './hooks/useDateRangeFilter';
import { MapDataLayerKey, MapTileLayerId } from './types';
import { HankeData } from '../types/hanke';

type Props = {
  projectsData: HankeData[];
};

// Temporary reference style implementation. Actual colors
// are chosen based on törmäysanalyysi
const geometryStyle = {
  Blue: new Style({
    stroke: new Stroke({
      color: 'black',
      width: 1,
    }),
    fill: new Fill({
      color: 'rgba(36, 114, 198, 1)',
    }),
  }),
};

const HankeMap: React.FC<Props> = ({ projectsData }) => {
  const { dataLayers, mapTileLayers, toggleDataLayer, toggleMapTileLayer } = useMapDataLayers();
  const {
    hankeFilterStartDate,
    hankeFilterEndDate,
    setHankeFilterStartDate,
    setHankeFilterEndDate,
  } = useDateRangeFilter();

  const [zoom] = useState(9); // TODO: also take zoom into consideration

  const hankeSources = useRef({ features: new VectorSource() });

  const hankkeetFilteredByAll = projectsData.filter(
    byAllHankeFilters({ startDate: hankeFilterStartDate, endDate: hankeFilterEndDate })
  );

  useEffect(() => {
    hankeSources.current.features.clear();
    hankkeetFilteredByAll.forEach((hanke) => {
      if (hanke.geometriat) {
        hankeSources.current.features.addFeatures(
          new GeoJSON().readFeatures(hanke.geometriat.featureCollection)
        );
      }
    });
  }, [hankkeetFilteredByAll]);

  return (
    <>
      <HankeSidebar />

      <div data-testid="countOfFilteredHankkeet" className={styles.hiddenTestDiv}>
        {hankkeetFilteredByAll.length}
      </div>
      <div
        className={styles.mapContainer}
        style={{ width: '100%', height: '100%', position: 'absolute' }}
      >
        <Map zoom={zoom} mapClassName={styles.mapContainer__inner}>
          {mapTileLayers.ortokartta.visible && <Ortokartta />}
          {mapTileLayers.kantakartta.visible && <Kantakartta />}
          <DataLayers />

          <VectorLayer
            source={hankeSources.current.features}
            zIndex={100}
            className="hankeGeometryLayer"
            style={geometryStyle.Blue}
          />

          <Controls>
            <DateRangeControl
              startDate={hankeFilterStartDate}
              updateStartDate={setHankeFilterStartDate}
              endDate={hankeFilterEndDate}
              updateEndDate={setHankeFilterEndDate}
            />
            <LayerControl
              tileLayers={Object.values(mapTileLayers)}
              onClickTileLayer={(id: MapTileLayerId) => toggleMapTileLayer(id)}
              dataLayers={Object.values(dataLayers)}
              onClickDataLayer={(key: MapDataLayerKey) => toggleDataLayer(key)}
            />
          </Controls>
        </Map>
      </div>
    </>
  );
};

export default HankeMap;
