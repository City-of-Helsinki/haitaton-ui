import React from 'react';
import clsx from 'clsx';
import styles from './ResponsiveGrid.module.scss';

type Props = {
  children: React.ReactNode;
  className?: string;
  maxColumns?: 2 | 3;
};

function ResponsiveGrid({ className, maxColumns = 3, children }: Readonly<Props>) {
  return (
    <div className={clsx([styles.container, className, styles[`maxColumns--${maxColumns}`]])}>
      {children}
    </div>
  );
}

export default ResponsiveGrid;
