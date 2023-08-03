import React from 'react';
import clsx from 'clsx';
import styles from './ResponsiveGrid.module.scss';

type Props = {
  children: React.ReactNode;
  // eslint-disable-next-line react/require-default-props
  className?: string;
};

function ResponsiveGrid({ className, children }: Props) {
  return <div className={clsx([styles.container, className])}>{children}</div>;
}

export default ResponsiveGrid;
