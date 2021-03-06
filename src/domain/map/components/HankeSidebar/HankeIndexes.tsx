import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  LIIKENNEHAITTA_STATUS,
  getStatusByIndex,
  getColorByStatus,
} from '../../../common/utils/liikennehaittaindeksi';
import Text from '../../../../common/components/text/Text';
import styles from './HankeIndexes.module.scss';
import { HankeIndexData } from '../../../types/hanke';

type IndexProps = {
  title: string;
  content?: string;
  index: number;
  testId: string;
};

const IndexSection: React.FC<IndexProps> = ({ title, content, index, testId }) => (
  <div className={styles.indexContainer}>
    <div className={styles.indexContainer__titlesContainer}>
      <Text tag="h3" styleAs={content ? 'h6' : 'h5'} weight="bold">
        {title}
      </Text>
      {content && (
        <Text tag="p" styleAs="body-m" data-testid={`${testId}-content`}>
          {content}
        </Text>
      )}
    </div>
    <div
      className={styles.indexContainer__number}
      style={{
        backgroundColor: getColorByStatus(getStatusByIndex(index)),
        color: getStatusByIndex(index) === LIIKENNEHAITTA_STATUS.YELLOW ? 'black' : 'white',
      }}
    >
      <div data-testid={testId}>{index}</div>
    </div>
  </div>
);

const getDetourNeedByIndex = (index: IndexProps['index']) => {
  const staticLocalisationKey = 'hankeIndexes:KIERTOREITTITARPEET:';
  if (index < 3) return `${staticLocalisationKey}EI_TARVETTA`;
  if (index < 4) return `${staticLocalisationKey}TODENNAKOINEN`;
  return `${staticLocalisationKey}MERKITTAVA`;
};

type Props = {
  hankeIndexData: HankeIndexData;
};

const HankeIndexes: React.FC<Props> = ({ hankeIndexData }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.indexes}>
      <IndexSection
        title={t('hankeIndexes:liikennehaittaindeksi')}
        index={hankeIndexData.liikennehaittaIndeksi.indeksi}
        testId="test-liikennehaittaIndeksi"
      />

      <IndexSection
        title={t('hankeIndexes:pyorailynPaareitti')}
        content={`${t('hankeIndexes:kiertoreittitarve')}: ${t(
          getDetourNeedByIndex(hankeIndexData.pyorailyIndeksi)
        )}`}
        index={hankeIndexData.pyorailyIndeksi}
        testId="test-pyorailyIndeksi"
      />

      <IndexSection
        title={t('hankeIndexes:merkittavatJoukkoliikennereitit')}
        content={`${t('hankeIndexes:kiertoreittitarve')}: ${t(
          getDetourNeedByIndex(hankeIndexData.joukkoliikenneIndeksi)
        )}`}
        index={hankeIndexData.joukkoliikenneIndeksi}
        testId="test-joukkoliikenneIndeksi"
      />

      <IndexSection
        title={t('hankeIndexes:ruuhkautuminen')}
        content={`${t('hankeIndexes:kiertoreittitarve')}: ${t(
          getDetourNeedByIndex(hankeIndexData.perusIndeksi)
        )}`}
        index={hankeIndexData.perusIndeksi}
        testId="test-ruuhkautumisIndeksi"
      />
    </div>
  );
};

export default HankeIndexes;
