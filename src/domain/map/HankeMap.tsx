import React, { useState } from 'react';
import Map from '../../common/components/map/Map';
import Controls from '../../common/components/map/controls/Controls';
import LayerControl from '../../common/components/map/controls/LayerControl';
import DateRangeControl from '../../common/components/map/controls/DateRangeControl';
import ControlPanel from '../../common/components/map/controls/ControlPanel';
import Kantakartta from './components/Layers/Kantakartta';
import Ortokartta from './components/Layers/Ortokartta';
import HankeLayer from './components/Layers/HankeLayer';
import HankeSidebar from './components/HankeSidebar/HankeSidebarContainer';
import styles from './Map.module.scss';
import { useMapDataLayers } from './hooks/useMapLayers';
import { useDateRangeFilter } from './hooks/useDateRangeFilter';
import { MapTileLayerId } from './types';
import FeatureClick from '../../common/components/map/interactions/FeatureClick';
import GeometryHover from '../../common/components/map/interactions/hover/GeometryHover';
import HankeHoverBox from './components/HankeHover/HankeHoverBox';
import MapGuide from './components/MapGuide/MapGuide';
import HankkeetProvider from './HankkeetProvider';
import MapControl from '../../common/components/map/controls/MapControl';

const HankeMap: React.FC = () => {
  const [zoom] = useState(9); // TODO: also take zoom into consideration
  const { mapTileLayers, toggleMapTileLayer } = useMapDataLayers();
  const {
    hankeFilterStartDate,
    hankeFilterEndDate,
    setHankeFilterStartDate,
    setHankeFilterEndDate,
  } = useDateRangeFilter();

  return (
    <>
      <div
        className={styles.mapContainer}
        style={{ width: '100%', height: '100%', position: 'absolute' }}
        id="hankemap"
      >
        <h1 className={styles.allyHeader}>Karttasivu</h1> {/* For a11y */}
        <Map zoom={zoom} mapClassName={styles.mapContainer__inner}>
          <MapGuide />
          {mapTileLayers.ortokartta.visible && <Ortokartta />}
          {mapTileLayers.kantakartta.visible && <Kantakartta />}
          <MapControl />

          <HankkeetProvider>
            <HankeSidebar />
            <FeatureClick />
            <GeometryHover>
              <HankeHoverBox />
              <HankeLayer />
            </GeometryHover>
          </HankkeetProvider>

          <Controls>
            <ControlPanel className={styles.dateRangeControl}>
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

export default HankeMap;
