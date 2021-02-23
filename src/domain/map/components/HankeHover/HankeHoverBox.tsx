import React, { useContext, useEffect, useState } from 'react';
import HoverContext from '../../../../common/components/map/interactions/hover/HoverContext';
import HankkeetContext from '../../HankkeetProviderContext';
import styles from './HankeHover.module.scss';
import { HankeData } from '../../../types/hanke';

const HankeHoverBox: React.FC = () => {
  const { hoveredHankeTunnus } = useContext(HoverContext);
  const { hankkeet } = useContext(HankkeetContext);
  const [hankeData, setHankeData] = useState<HankeData>();

  useEffect(() => {
    if (hoveredHankeTunnus.length > 0) {
      const foundHanke = hankkeet.find((hanke) => hanke.hankeTunnus === hoveredHankeTunnus);
      setHankeData(foundHanke);
    } else {
      setHankeData(undefined);
    }
  }, [hoveredHankeTunnus]);

  return (
    <div className={styles.hankeHover}>
      <h1>Hovering on {hoveredHankeTunnus}</h1>
      <p>{hankeData?.nimi}</p>
      <p>{hankeData?.alkuPvm}</p>
      <p>{hankeData?.loppuPvm}</p>
    </div>
  );
};

export default HankeHoverBox;
