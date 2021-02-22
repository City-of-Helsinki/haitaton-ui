import React, { useContext } from 'react';
import { IconPen, IconStarFill } from 'hds-react';
import clsx from 'clsx';
import { $enum } from 'ts-enum-util';
import ControlPanel from './ControlPanel';
import styles from './Controls.module.scss';
import MapContext from '../MapContext';
import { DRAWTOOLTYPE } from '../constants';

const getDrawIcon = (drawTool: DRAWTOOLTYPE) => {
  switch (drawTool) {
    case DRAWTOOLTYPE.SQUARE:
      return <IconStarFill size="m" aria-hidden="true" />;
    case DRAWTOOLTYPE.POLYGON:
      return <IconPen size="s" aria-hidden="true" />;
    default:
      return null;
  }
};

const DrawControls: React.FC = () => {
  const { setSelectedDrawtoolType, selectedDrawtoolType } = useContext(MapContext);

  return (
    <ControlPanel className={styles.drawControl}>
      {$enum(DRAWTOOLTYPE)
        .getValues()
        .map((v) => (
          <button
            key={v}
            className={clsx(styles.drawControl__button, {
              [styles['drawControl__button--active']]: selectedDrawtoolType === v,
            })}
            type="button"
            data-testid={`draw-control-${v}`}
            onClick={() => setSelectedDrawtoolType(v)}
            title="Jepa"
          >
            {getDrawIcon(v)}
          </button>
        ))}
    </ControlPanel>
  );
};

export default DrawControls;
