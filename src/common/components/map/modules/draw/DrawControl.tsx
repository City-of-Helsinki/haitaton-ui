import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { IconPen } from 'hds-react';
import clsx from 'clsx';
import { $enum } from 'ts-enum-util';
import IconSquare from '../../../icons/Square';
import ControlPanel from '../../controls/ControlPanel';
import styles from '../../controls/Controls.module.scss';
import { DrawContext } from './DrawContext';
import { DRAWTOOLTYPE } from './types';

const getDrawIcon = (drawTool: DRAWTOOLTYPE) => {
  switch (drawTool) {
    case DRAWTOOLTYPE.SQUARE:
      return <IconSquare aria-hidden="true" />;
    case DRAWTOOLTYPE.POLYGON:
      return <IconPen size="s" aria-hidden="true" />;
    default:
      return null;
  }
};

const DrawControls: React.FC = () => {
  const { t } = useTranslation();
  const { state, actions } = useContext(DrawContext);

  if (!state || !actions) return null;

  return (
    <ControlPanel className={styles.drawControl}>
      {$enum(DRAWTOOLTYPE)
        .getValues()
        .map((v) => (
          <button
            key={v}
            className={clsx(styles.drawControl__button, {
              [styles['drawControl__button--active']]: state.selectedDrawtoolType === v,
            })}
            aria-label={
              v === DRAWTOOLTYPE.SQUARE
                ? t('map:drawSquareButtonAria')
                : t('map:drawPolygonButtonAria')
            }
            type="button"
            data-testid={`draw-control-${v}`}
            onClick={() => {
              if (v === state.selectedDrawtoolType) {
                actions.setSelectedDrawToolType(null);
              } else {
                actions.setSelectedDrawToolType(v);
              }
            }}
          >
            {getDrawIcon(v)}
          </button>
        ))}
    </ControlPanel>
  );
};

export default DrawControls;
