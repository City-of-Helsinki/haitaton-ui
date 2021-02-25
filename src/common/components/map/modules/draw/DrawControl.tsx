import React, { useContext } from 'react';
<<<<<<< HEAD
import { useTranslation } from 'react-i18next';
import { IconPen } from 'hds-react';
=======
import { IconPen, IconStarFill, IconTrash } from 'hds-react';
>>>>>>> 13182a4... HAI-718: Remove geometry feature
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
  const { state, actions, source } = useContext(DrawContext);

  if (!state || !actions) return null;

  const handleRemoveFeature = () => {
    if (source && state.selectedFeature !== null && source.hasFeature(state.selectedFeature)) {
      source?.removeFeature(state.selectedFeature);
    }
  };

  const handleClickDrawTool = (drawToolType: DRAWTOOLTYPE) => {
    if (drawToolType === state.selectedDrawtoolType) {
      actions.setSelectedDrawToolType(null);
    } else {
      actions.setSelectedDrawToolType(drawToolType);
    }
  };

  return (
    <ControlPanel className={styles.drawControl}>
      {state?.selectedFeature && (
        <button
          type="button"
          className={clsx(styles.drawControl__button)}
          onClick={handleRemoveFeature}
        >
          <IconTrash size="m" aria-hidden="true" />
        </button>
      )}
      {$enum(DRAWTOOLTYPE)
        .getValues()
        .map((drawToolType) => (
          <button
            key={drawToolType}
            className={clsx(styles.drawControl__button, {
              [styles['drawControl__button--active']]: state.selectedDrawtoolType === drawToolType,
            })}
            aria-label={
              v === DRAWTOOLTYPE.SQUARE
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
