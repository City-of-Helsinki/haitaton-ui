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
  mainIndex?: boolean;
};

const IndexSection: React.FC<IndexProps> = ({
  title,
  content,
  index,
  testId,
  loading,
  mainIndex,
}) => (
  <div className={styles.indexContainer}>
    <div className={styles.indexContainer__titlesContainer}>
      <Text
        tag="h3"
        styleAs={mainIndex ? 'body-m' : 'body-s'}
        weight={mainIndex ? 'bold' : 'normal'}
      >
        {title}
      </Text>
      {content && (
        <Text tag="p" styleAs="body-s" data-testid={`${testId}-content`}>
          {content}
        </Text>
      )}
    </div>
    <div className={styles.indexContainer__number}>
      {loading && <LoadingSpinner small />}
      {!loading && (
        <>
          {!mainIndex && (
            <Text tag="p" styleAs="body-s" className={styles.indexContainer__number__description}>
              Haittaindeksi
            </Text>
          )}
          <div
            style={{
              backgroundColor: getColorByStatus(getStatusByIndex(index)),
              color: getStatusByIndex(index) === LIIKENNEHAITTA_STATUS.YELLOW ? 'black' : 'white',
              width: '38px',
            }}
          >
            <div data-testid={testId}>{index === undefined ? '-' : index}</div>
          </div>
        </>
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
  indexTitle?: string;
  displayTooltip?: boolean;
  loading?: boolean;
  containerClassName?: string;
};

const HankeIndexes: React.FC<Props> = ({
  hankeIndexData,
  indexTitle,
  displayTooltip,
  loading,
  containerClassName,
}) => {
  const { t } = useTranslation();
  const hankeIndexTitle = indexTitle || t('hankeIndexes:haittaindeksit');
  const liikennehaittaIndeksi = hankeIndexData?.liikennehaittaIndeksi.indeksi;
  const pyorailyIndeksi = hankeIndexData?.pyorailyIndeksi;
  const joukkoliikenneIndeksi = hankeIndexData?.joukkoliikenneIndeksi;
  const perusIndeksi = hankeIndexData?.perusIndeksi;

  return (
    <div className={containerClassName}>
      <div className={styles.indexTitle}>
        <Text tag="h2" styleAs="h4" weight="bold">
          {hankeIndexTitle}
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
          mainIndex
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
