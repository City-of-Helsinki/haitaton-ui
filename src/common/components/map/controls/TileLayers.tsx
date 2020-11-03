import React from 'react';
import { RadioButton } from 'hds-react';
import ControlPanel from './ControlPanel';
import styles from './Controls.module.scss';

type TileLayer = {
  id: string;
  label: string;
  checked: boolean;
  onClick: () => void;
};

type Props = {
  layers: TileLayer[];
};

const TileLayers: React.FC<Props> = ({ layers }) => (
  <ControlPanel className={styles.tileLayerControl}>
    {layers.map(({ id, onClick, checked, label }) => (
      <RadioButton
        key={id}
        id={id}
        className={styles.tileLayerControl__button}
        label={label}
        onClick={() => onClick()}
        checked={checked}
      />
    ))}
  </ControlPanel>
);

export default TileLayers;
