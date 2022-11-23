import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconPen } from 'hds-react';
import clsx from 'clsx';
import { $enum } from 'ts-enum-util';
import IconSquare from '../../../icons/Square';
import ControlPanel from '../../controls/ControlPanel';
import styles from '../../controls/Controls.module.scss';
import { DRAWTOOLTYPE } from './types';
import useDrawContext from './useDrawContext';

const getDrawIcon = (drawTool: DRAWTOOLTYPE) => {
  switch (drawTool) {
    case DRAWTOOLTYPE.SQUARE:
      return (
        <div className={styles.drawControl__svgIcon}>
          <IconSquare aria-hidden="true" />
        </div>
      );
    case DRAWTOOLTYPE.POLYGON:
      return <IconPen size="s" aria-hidden="true" />;
    default:
      return null;
  }
};

const DrawControls: React.FC = () => {
  const { t } = useTranslation();
  const { state, actions } = useDrawContext();

  const handleClickDrawTool = (drawToolType: DRAWTOOLTYPE) => {
    if (drawToolType === state.selectedDrawtoolType) {
      actions.setSelectedDrawToolType(null);
    } else {
      actions.setSelectedDrawToolType(drawToolType);
    }
  };

  return (
    <ControlPanel className={styles.drawControl}>
      {$enum(DRAWTOOLTYPE)
        .getValues()
        .map((drawToolType) => (
          <button
            key={drawToolType}
            className={clsx(styles.drawControl__button, {
              [styles['drawControl__button--active']]: state.selectedDrawtoolType === drawToolType,
            })}
            aria-label={
              drawToolType === DRAWTOOLTYPE.SQUARE
                ? t('map:drawSquareButtonAria')
                : t('map:drawPolygonButtonAria')
            }
            type="button"
            data-testid={`draw-control-${drawToolType}`}
            onClick={() => handleClickDrawTool(drawToolType)}
          >
            {getDrawIcon(drawToolType)}
          </button>
        ))}
    </ControlPanel>
  );
};

export default DrawControls;
