import React from 'react';
import clsx from 'clsx';
import styles from './Container.module.scss';

type Props = {
  children: React.ReactNode;
  className?: string;
};

const Container: React.FC<React.PropsWithChildren<Props>> = ({ children, className }) => {
  return <div className={clsx(styles.limitedWidthContainer, className)}>{children}</div>;
};

export default Container;
