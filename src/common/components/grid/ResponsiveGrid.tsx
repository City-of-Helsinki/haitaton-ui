/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import clsx from 'clsx';
import styles from './ResponsiveGrid.module.scss';

type Props = {
  className?: string;
};

const ResponsiveGrid: React.FC<Props> = ({ className, children }) => {
  return <div className={clsx([styles.container, className])}>{children}</div>;
};

export default ResponsiveGrid;
