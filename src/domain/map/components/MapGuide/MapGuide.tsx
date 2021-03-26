import React from 'react';
import { useTranslation } from 'react-i18next';
import { $enum } from 'ts-enum-util';
import {
  LIIKENNEHAITTA_STATUS,
  getColorByStatus,
} from '../../../common/utils/liikennehaittaindeksi';
import styles from './MapGuide.module.scss';

const MapGuide = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.mapGuide}>
      {$enum(LIIKENNEHAITTA_STATUS).map((status) => (
        <div key={status}>
          <span
            className={styles.mapGuide__colorBox}
            style={{
              background: getColorByStatus(status),
            }}
          />
          <span className={styles.mapGuide__text}>{t(`map:guide:indexColor:${status}`)}</span>
        </div>
      ))}
    </div>
  );
};

export default MapGuide;
