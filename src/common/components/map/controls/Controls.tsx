import React from 'react';
import styles from './Controls.module.scss';

const Controls: React.FC = ({ children }) => <div className={styles.controls}>{children}</div>;

export default Controls;
