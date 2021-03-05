import React from 'react';
import { LoadingSpinner } from 'hds-react';

import styles from './Styles.module.scss';

const OverlaySpinner = () => {
  return (
    <>
      <div className={styles.spinner}>
        <div className={styles.spinner__bg} />
        <div className={styles.spinner__content}>
          <LoadingSpinner />
        </div>
      </div>
    </>
  );
};

export default OverlaySpinner;
