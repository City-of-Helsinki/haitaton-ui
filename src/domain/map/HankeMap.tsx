import React, { useCallback, useState } from 'react';
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
import HankkeetProvider from './HankkeetProvider';
import OverviewMapControl from '../../common/components/map/controls/OverviewMapControl';
import AddressSearchContainer from './components/AddressSearch/AddressSearchContainer';
import { HankeAlue } from '../types/hanke';
import { areDatesWithinInterval } from './utils';

const HankeMap: React.FC<React.PropsWithChildren<unknown>> = () => {
  const [zoom] = useState(9); // TODO: also take zoom into consideration
  const { mapTileLayers, toggleMapTileLayer } = useMapDataLayers();
  const ortoLayerOpacity = mapTileLayers.kantakartta.visible ? 0.5 : 1;
  const {
    hankeFilterStartDate,
    hankeFilterEndDate,
    setHankeFilterStartDate,
    setHankeFilterEndDate,
  } = useDateRangeFilter();
  const filterHankeAlueet = useCallback(
    (alueet: HankeAlue[]) => {
      return alueet.filter((alue) =>
        areDatesWithinInterval(
          {
            start: hankeFilterStartDate,
            end: hankeFilterEndDate,
          },
          { allowOverlapping: true },
        )({
          start: alue.haittaAlkuPvm,
          end: alue.haittaLoppuPvm,
        }),
      );
    },
    [hankeFilterStartDate, hankeFilterEndDate],
  );

  return (
    <div className={styles.mapContainer} id="hankemap">
      <Map zoom={zoom} mapClassName={styles.mapContainer__inner}>
        <AddressSearchContainer position={{ top: '1rem', left: '1rem' }} />

        {mapTileLayers.kantakartta.visible && <Kantakartta />}
        {mapTileLayers.ortokartta.visible && <Ortokartta opacity={ortoLayerOpacity} />}
        <OverviewMapControl />

        <HankkeetProvider>
          <HankeSidebar />
          <FeatureClick />
          <GeometryHover>
            <HankeHoverBox />
            <HankeLayer filterHankeAlueet={filterHankeAlueet} centerOnMap highlightFeatures />
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
  );
};

export default HankeMap;
