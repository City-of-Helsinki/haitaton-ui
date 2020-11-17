import React from 'react';
import styles from './Text.module.scss';
import { TextComponentProps } from './types';

const H3 = ({ children, stylesAs }: TextComponentProps) => (
  <h3 className={stylesAs ? styles[stylesAs] : styles.h3}>{children}</h3>
);

export default H3;
