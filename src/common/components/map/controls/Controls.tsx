import React from 'react';
import styles from './Controls.module.scss';

const Controls: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => (
  <div className={styles.controlLayer}>{children}</div>
);

export default Controls;
