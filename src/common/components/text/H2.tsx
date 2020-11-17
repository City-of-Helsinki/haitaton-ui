import React from 'react';
import styles from './Text.module.scss';
import { TextComponentProps } from './types';

const H2 = ({ children, stylesAs }: TextComponentProps) => (
  <h2 className={stylesAs ? styles[stylesAs] : styles.h2}>{children}</h2>
);

export default H2;
