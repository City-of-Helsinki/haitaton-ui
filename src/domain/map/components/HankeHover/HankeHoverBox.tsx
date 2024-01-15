import React, { useContext } from 'react';
import { format } from 'date-fns';
import { Link } from 'hds-react';
import { useNavigate } from 'react-router-dom';
import HoverContext from '../../../../common/components/map/interactions/hover/HoverContext';
import HankkeetContext from '../../HankkeetProviderContext';
import styles from './HankeHover.module.scss';
import { HankeData } from '../../../types/hanke';

const HankeHoverBox: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { hoveredHankeTunnukset, hoverPosition } = useContext(HoverContext);
  const { hankkeet } = useContext(HankkeetContext);
  const foundHankkeet: HankeData[] = [];

  const navigate = useNavigate();

  const hoverBoxPosition = {
    top: hoverPosition[1] - 16 || 0,
    left: hoverPosition[0] + 2 || 0,
  };

  if (hoveredHankeTunnukset.length > 0) {
    hoveredHankeTunnukset.forEach((hankeTunnus) => {
      const hanke = hankkeet.find((HANKE) => HANKE.hankeTunnus === hankeTunnus);
      if (hanke) {
        foundHankkeet.push(hanke);
      }
    });
  }

  const openHanke = (e: React.MouseEvent, hankeTunnus: string) => {
    e.preventDefault();
    navigate({
      search: `?hanke=${hankeTunnus}`,
    });
  };

  return (
    <div className={styles.hankeHover} style={hoverBoxPosition}>
      {foundHankkeet.map((hanke) => (
        <div key={hanke.hankeTunnus}>
          <Link
            href={`/?hanke=${hanke.hankeTunnus}`}
            size="M"
            onClick={(e) => openHanke(e, hanke.hankeTunnus)}
          >
            {`${hanke.nimi} (${hanke.hankeTunnus})`}
          </Link>
          {hanke.alkuPvm && hanke.loppuPvm && (
            <p>
              {format(new Date(hanke.alkuPvm), 'dd.MM.yyyy')} -{' '}
              {format(new Date(hanke.loppuPvm), 'dd.MM.yyyy')}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default HankeHoverBox;
