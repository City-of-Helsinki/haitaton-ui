import React from 'react';
import styles from './Container.module.scss';

type Props = {
  children: React.ReactNode;
};

const Container: React.FC<Props> = ({ children }) => {
  return <div className={styles.limitedWidthContainer}>{children}</div>;
};

export default Container;
