import React, { useContext } from 'react';
import { format } from 'date-fns';
import HoverContext from '../../../../common/components/map/interactions/hover/HoverContext';
import HankkeetContext from '../../HankkeetProviderContext';
import styles from './HankeHover.module.scss';
import { HankeData } from '../../../types/hanke';

const HankeHoverBox: React.FC = () => {
  const { hoveredHankeTunnus } = useContext(HoverContext);
  const { hankkeet } = useContext(HankkeetContext);
  let foundHanke: HankeData | undefined;

  if (hoveredHankeTunnus.length > 0) {
    foundHanke = hankkeet.find((hanke) => hanke.hankeTunnus === hoveredHankeTunnus);
  } else {
    foundHanke = undefined;
  }

  return (
    <div className={styles.hankeHover}>
      {foundHanke && (
        <div>
          <p>{foundHanke?.nimi}</p>
          <p>({hoveredHankeTunnus})</p>
          <p>{format(new Date(foundHanke?.alkuPvm), 'dd.MM.yyyy')}</p>
          <p>{format(new Date(foundHanke?.loppuPvm), 'dd.MM.yyyy')}</p>
        </div>
      )}
    </div>
  );
};

export default HankeHoverBox;
