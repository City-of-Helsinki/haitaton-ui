import React, { useEffect, useRef, useState, useMemo } from 'react';
import GeoJSON from 'ol/format/GeoJSON';
import { Vector as VectorSource } from 'ol/source';
import { Style, Fill, Stroke } from 'ol/style';
import Map from '../../common/components/map/Map';
import Controls from '../../common/components/map/controls/Controls';
import LayerControl from '../../common/components/map/controls/LayerControl';
import DateRangeControl from '../../common/components/map/controls/DateRangeControl';
import VectorLayer from '../../common/components/map/layers/VectorLayer';
import Kantakartta from './components/Layers/Kantakartta';
import Ortokartta from './components/Layers/Ortokartta';
import HankeSidebar from './components/HankeSidebar/HankeSidebarContainer';
import styles from './Map.module.scss';
import { byAllHankeFilters } from './utils';
import { useMapDataLayers } from './hooks/useMapLayers';
import { useDateRangeFilter } from './hooks/useDateRangeFilter';
import { MapTileLayerId } from './types';
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
  const hankeSources = useRef({ features: new VectorSource() });
  const [zoom] = useState(9); // TODO: also take zoom into consideration
  const { mapTileLayers, toggleMapTileLayer } = useMapDataLayers();
  const {
    hankeFilterStartDate,
    hankeFilterEndDate,
    setHankeFilterStartDate,
    setHankeFilterEndDate,
  } = useDateRangeFilter();

  const hankkeetFilteredByAll = useMemo(
    () =>
      projectsData.filter(
        byAllHankeFilters({ startDate: hankeFilterStartDate, endDate: hankeFilterEndDate })
      ),
    [projectsData, hankeFilterStartDate, hankeFilterEndDate]
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
      <div data-testid="countOfFilteredHankkeet" className={styles.hiddenTestDiv}>
        {hankkeetFilteredByAll.length}
      </div>
      <HankeSidebar />
      <div
        className={styles.mapContainer}
        style={{ width: '100%', height: '100%', position: 'absolute' }}
      >
        <Map zoom={zoom} mapClassName={styles.mapContainer__inner}>
          {mapTileLayers.ortokartta.visible && <Ortokartta />}
          {mapTileLayers.kantakartta.visible && <Kantakartta />}

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
            />
          </Controls>
        </Map>
      </div>
    </>
  );
};

export default HankeMap;
