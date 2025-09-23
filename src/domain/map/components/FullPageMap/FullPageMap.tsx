import React from 'react';
import Map from '../../../../common/components/map/Map';
import OverviewMapControl from '../../../../common/components/map/controls/OverviewMapControl';
import Kantakartta from '../Layers/Kantakartta';
import styles from './FullPageMap.module.scss';
import AddressSearchContainer from '../AddressSearch/AddressSearchContainer';
import SimpleHankeLayer from '../Layers/SimpleHankeLayer';
import GeometryHover from '../../../../common/components/map/interactions/hover/GeometryHover';
import HankeHoverBox from '../HankeHover/HankeHoverBox';
import FeatureClick from '../../../../common/components/map/interactions/FeatureClick';
import HankeSidebarContainer from '../HankeSidebar/HankeSidebarContainer';

type Props = {
  hankeTunnus?: string;
};

const FullPageMap: React.FC<Props> = () => {
  return (
    <div className={styles.mapContainer}>
      <Map zoom={9} mapClassName={styles.mapContainer__inner}>
        <AddressSearchContainer position={{ top: '1rem', left: '1rem' }} />
        <Kantakartta />
        <OverviewMapControl />

        <HankeSidebarContainer />
        <FeatureClick />
        <GeometryHover>
          <HankeHoverBox />
          <SimpleHankeLayer startDate={null} endDate={null} />
        </GeometryHover>
      </Map>
    </div>
  );
};

export default FullPageMap;
