import React from 'react';
import styles from './Text.module.scss';
import { TextComponentProps } from './types';

const H1 = ({ children, stylesAs, ...rest }: TextComponentProps) => (
  <h1 className={stylesAs ? styles[stylesAs] : styles.h1} {...rest}>
    {children}
  </h1>
);

export default H1;
