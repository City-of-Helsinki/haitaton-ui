import React from 'react';
import clsx from 'clsx';
import styles from './Controls.module.scss';

type Props = {
  children: React.ReactNode;
  className: string;
};

const ControlPanel: React.FC<Props> = ({ children, className }) => (
  <div className={clsx([styles.controlPanel, className])}>{children}</div>
);

export default ControlPanel;
