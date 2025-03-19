import React, { useContext } from 'react';
import { Link } from 'hds-react';
import { useNavigate } from 'react-router-dom';
import HoverContext from '../../../../common/components/map/interactions/hover/HoverContext';
import styles from './HankeHover.module.scss';
import Text from '../../../../common/components/text/Text';

const HankeHoverBox: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { hoveredHankeAreaData, hoverPosition } = useContext(HoverContext);

  const navigate = useNavigate();

  const hoverBoxPosition = {
    top: hoverPosition[1] - 16 || 0,
    left: hoverPosition[0] + 2 || 0,
  };

  const openHanke = (e: React.MouseEvent, hankeTunnus?: string | null) => {
    e.preventDefault();
    if (!hankeTunnus) return;
    navigate({
      search: `?hanke=${hankeTunnus}`,
    });
  };

  return (
    <div className={styles.hankeHover} style={hoverBoxPosition}>
      {hoveredHankeAreaData.map((hankeArea) => (
        <div key={hankeArea.hankeTunnus}>
          <Link
            href={`/?hanke=${hankeArea.hankeTunnus}`}
            size="M"
            onClick={(e) => openHanke(e, hankeArea.hankeTunnus)}
          >
            {`${hankeArea.hankeName} (${hankeArea.hankeTunnus})`}
          </Link>
          <Text tag="p">{hankeArea.areaName}</Text>

          {hankeArea.startDate && hankeArea.endDate && (
            <Text tag="p">{`${hankeArea.startDate} - ${hankeArea.endDate}`}</Text>
          )}
        </div>
      ))}
    </div>
  );
};

export default HankeHoverBox;
