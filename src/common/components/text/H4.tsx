import React from 'react';
import styles from './Text.module.scss';
import { TextComponentProps } from './types';

const H4 = ({ children, stylesAs }: TextComponentProps) => (
  <h4 className={stylesAs ? styles[stylesAs] : styles.h4}>{children}</h4>
);

export default H4;
