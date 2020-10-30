import React from 'react';
import { RadioButton } from 'hds-react';

import styles from './Controls.module.scss';

type Layer = {
  id: string;
  checked: boolean;
  onClick: () => void;
};

type Props = {
  layers: Layer[];
};

const TileLayers: React.FC<Props> = ({ layers }) => (
  <div className={styles.tileLayers}>
    {layers.map(({ id, onClick, checked }) => (
      <RadioButton id={id} label={id} onClick={() => onClick()} checked={checked} />
    ))}
  </div>
);

export default TileLayers;
