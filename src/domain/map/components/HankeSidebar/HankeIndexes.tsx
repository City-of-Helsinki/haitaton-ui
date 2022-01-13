import React from 'react';
import { useTranslation } from 'react-i18next';
import { LoadingSpinner, Tooltip } from 'hds-react';
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
  index: number | undefined;
  testId: string;
  loading?: boolean;
};

const IndexSection: React.FC<IndexProps> = ({ title, content, index, testId, loading }) => (
  <div className={styles.indexContainer}>
    <div className={styles.indexContainer__titlesContainer}>
      <Text tag="h2" styleAs={content ? 'h6' : 'h5'} weight="bold">
        {title}
      </Text>
      {content && (
        <Text tag="p" styleAs="body-m" data-testid={`${testId}-content`}>
          {content}
        </Text>
      )}
    </div>
    <div className={styles.indexContainer__number}>
      {content && <div>&nbsp;</div>}
      {loading && <LoadingSpinner small />}
      {!loading && (
        <div
          style={{
            backgroundColor: getColorByStatus(getStatusByIndex(index)),
            color: getStatusByIndex(index) === LIIKENNEHAITTA_STATUS.YELLOW ? 'black' : 'white',
          }}
        >
          <div data-testid={testId}>{index === undefined ? '-' : index}</div>
        </div>
      )}
    </div>
  </div>
);

const getDetourNeedByIndex = (index: IndexProps['index'] | undefined) => {
  if (!index) return '-';
  const staticLocalisationKey = 'hankeIndexes:KIERTOREITTITARPEET:';
  if (index < 3) return `${staticLocalisationKey}EI_TARVETTA`;
  if (index < 4) return `${staticLocalisationKey}TODENNAKOINEN`;
  return `${staticLocalisationKey}MERKITTAVA`;
};

type Props = {
  hankeIndexData: HankeIndexData | null | undefined;
  displayTooltip?: boolean;
  loading?: boolean;
};

const HankeIndexes: React.FC<Props> = ({ hankeIndexData, displayTooltip, loading }) => {
  const { t } = useTranslation();
  const liikennehaittaIndeksi = hankeIndexData?.liikennehaittaIndeksi.indeksi;
  const pyorailyIndeksi = hankeIndexData?.pyorailyIndeksi;
  const joukkoliikenneIndeksi = hankeIndexData?.joukkoliikenneIndeksi;
  const perusIndeksi = hankeIndexData?.perusIndeksi;

  return (
    <div>
      <div className={styles.indexTitle}>
        <Text tag="h2" styleAs="h5" weight="bold">
          {t('hankeIndexes:haittaindeksit')}
        </Text>
        {displayTooltip && (
          <Tooltip placement="right" className={styles.indexTooltip}>
            {t('hankeIndexes:haittaindexTooltip')}
          </Tooltip>
        )}
      </div>
      <div className={styles.indexes}>
        <IndexSection
          title={t('hankeIndexes:liikennehaittaindeksi')}
          index={liikennehaittaIndeksi}
          testId="test-liikennehaittaIndeksi"
          loading={loading}
        />

        <IndexSection
          title={t('hankeIndexes:pyorailynPaareitti')}
          content={`${t('hankeIndexes:kiertoreittitarve')}: ${t(
            getDetourNeedByIndex(pyorailyIndeksi)
          )}`}
          index={pyorailyIndeksi}
          testId="test-pyorailyIndeksi"
          loading={loading}
        />

        <IndexSection
          title={t('hankeIndexes:merkittavatJoukkoliikennereitit')}
          content={`${t('hankeIndexes:kiertoreittitarve')}: ${t(
            getDetourNeedByIndex(joukkoliikenneIndeksi)
          )}`}
          index={joukkoliikenneIndeksi}
          testId="test-joukkoliikenneIndeksi"
          loading={loading}
        />

        <IndexSection
          title={t('hankeIndexes:ruuhkautuminen')}
          content={`${t('hankeIndexes:kiertoreittitarve')}: ${t(
            getDetourNeedByIndex(perusIndeksi)
          )}`}
          index={perusIndeksi}
          testId="test-ruuhkautumisIndeksi"
          loading={loading}
        />
        {hankeIndexData === undefined && (
          <p className={styles.indexInfo}>{t('hankeIndexes:indexesNotCalculated')}</p>
        )}
      </div>
    </div>
  );
};

export default HankeIndexes;
