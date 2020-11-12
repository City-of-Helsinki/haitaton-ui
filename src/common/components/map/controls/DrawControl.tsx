import React, { useContext } from 'react';
import { IconPen } from 'hds-react';
import clsx from 'clsx';
import { $enum } from 'ts-enum-util';
import ControlPanel from './ControlPanel';
import styles from './Controls.module.scss';
import MapContext from '../MapContext';
import { DrawTool } from '../constants';

const getDrawIcon = (drawTool: DrawTool) => {
  switch (drawTool) {
    /* case DrawTool.CIRCLE:
      return <IconPlusCircle size="m" aria-hidden="true" />; */
    case DrawTool.POLYGON:
      return <IconPen size="s" aria-hidden="true" />;
    default:
      return null;
  }
};

const DrawControls: React.FC = () => {
  const { setDrawTool, drawTool } = useContext(MapContext);

  return (
    <ControlPanel className={styles.drawControl}>
      {$enum(DrawTool)
        .getValues()
        .map((drawToolVal) => (
          <button
            key={drawToolVal}
            className={clsx(styles.drawControl__button, {
              [styles['drawControl__button--active']]: drawTool === drawToolVal,
            })}
            type="button"
            onClick={() => setDrawTool(drawToolVal)}
          >
            {getDrawIcon(drawToolVal)}
          </button>
        ))}
    </ControlPanel>
  );
};

export default DrawControls;
