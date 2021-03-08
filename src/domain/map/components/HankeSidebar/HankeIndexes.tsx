import React from 'react';
import { StatusLabel } from 'hds-react';
import Text from '../../../../common/components/text/Text';
import styles from './HankeIndexes.module.scss';

type Props = {
  hankeTunnus: string; // FIXME
};

const HankeIndexes: React.FC<Props> = ({ hankeTunnus }) => {
  return (
    <div className={styles.indexes}>
      <h1>{hankeTunnus}</h1>
      <div className={styles.indexContainer}>
        <div className={styles.indexContainer__titlesContainer}>
          <Text tag="h3" styleAs="h5" weight="bold">
            Liikennehaittaindeksi
          </Text>
        </div>
        <div
          className={styles.indexContainer__statusContainer}
          data-testid="sidebar-liikennehaittaindeksi"
        >
          <StatusLabel type="error">4</StatusLabel>
        </div>
      </div>
      <div className={styles.indexContainer}>
        <div className={styles.indexContainer__titlesContainer}>
          <Text tag="h3" styleAs="h6" weight="bold">
            Ruuhkautuminen
          </Text>
          <Text tag="p" styleAs="body-m">
            Kiertoreittitarve: todennäköinen
          </Text>
        </div>
        <div className={styles.indexContainer__statusContainer}>
          <StatusLabel type="alert">2.7</StatusLabel>
        </div>
      </div>
      <div className={styles.indexContainer}>
        <div className={styles.indexContainer__titlesContainer}>
          <Text tag="h3" styleAs="h6" weight="bold">
            Pyöräilyn pääreitti
          </Text>
          <Text tag="p" styleAs="body-m">
            Kiertoreittitarve: ei tarvetta
          </Text>
        </div>
        <div className={styles.indexContainer__statusContainer}>
          <StatusLabel type="success">1</StatusLabel>
        </div>
      </div>
    </div>
  );
};

export default HankeIndexes;
