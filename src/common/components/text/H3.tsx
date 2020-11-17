import React from 'react';
import styles from './Text.module.scss';
import { TextComponentProps } from './types';

const H3 = ({ children, stylesAs, ...rest }: TextComponentProps) => (
  <h3 className={stylesAs ? styles[stylesAs] : styles.h3} {...rest}>
    {children}
  </h3>
);

export default H3;
