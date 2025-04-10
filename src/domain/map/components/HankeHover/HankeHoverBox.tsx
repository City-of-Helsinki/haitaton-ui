import React, { useContext } from 'react';
import { Link } from 'hds-react';
import { useNavigate } from 'react-router-dom';
import HoverContext from '../../../../common/components/map/interactions/hover/HoverContext';
import styles from './HankeHover.module.scss';
import Text from '../../../../common/components/text/Text';
import { format } from 'date-fns';

const HankeHoverBox: React.FC<React.PropsWithChildren> = () => {
  const { hoveredHankeAreaData, hoverPosition } = useContext(HoverContext);

  const navigate = useNavigate();

  const hoverBoxPosition = {
    top: hoverPosition[1] - 16 || 0,
    left: hoverPosition[0] + 2 || 0,
  };

  const openHanke = (
    e: React.MouseEvent,
    hankeTunnus?: string | null,
    hankealueId?: number | null,
  ) => {
    e.preventDefault();
    if (!hankeTunnus) return;
    navigate({
      search: `?hanke=${hankeTunnus}&hankealue=${hankealueId}`,
    });
  };

  return (
    <div className={styles.hankeHover} style={hoverBoxPosition}>
      {hoveredHankeAreaData.map((hankeArea) => (
        <div key={hankeArea.hankeTunnus}>
          <Link
            href={`/?hanke=${hankeArea.hankeTunnus}&hankealue=${hankeArea.areaId}`}
            size="M"
            onClick={(e) => openHanke(e, hankeArea.hankeTunnus, hankeArea.areaId)}
          >
            {`${hankeArea.hankeName} (${hankeArea.hankeTunnus})`}
          </Link>
          <Text tag="p">{hankeArea.areaName}</Text>

          {hankeArea.startDate && hankeArea.endDate && (
            <Text tag="p">{`${format(new Date(hankeArea.startDate), 'dd.MM.yyyy')} - ${format(new Date(hankeArea.endDate), 'dd.MM.yyyy')}`}</Text>
          )}
        </div>
      ))}
    </div>
  );
};

export default HankeHoverBox;
