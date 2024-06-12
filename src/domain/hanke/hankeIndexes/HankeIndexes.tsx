import React from 'react';
import { useTranslation } from 'react-i18next';
import { LoadingSpinner, Tooltip } from 'hds-react';
import clsx from 'clsx';
import Text from '../../../common/components/text/Text';
import styles from './HankeIndexes.module.scss';
import HaittaIndexNumber from '../../common/haittaIndexes/HaittaIndexNumber';
import { HaittaIndexData } from '../../common/haittaIndexes/types';

type IndexProps = {
  title: string;
  content?: string;
  index: number | undefined;
  testId: string;
  loading?: boolean;
  mainIndex?: boolean;
  showIndexText?: boolean;
};

const IndexSection: React.FC<React.PropsWithChildren<IndexProps>> = ({
  title,
  content,
  index,
  testId,
  loading,
  mainIndex,
  showIndexText = true,
}) => {
  const { t } = useTranslation();

  return (
    <div className={styles.indexContainer}>
      <div className={styles.indexContainer__titlesContainer}>
        <Text
          tag="p"
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
      <div
        className={clsx(styles.indexContainer__number, {
          [styles['indexContainer__number--minWidth']]: showIndexText,
        })}
      >
        {loading && <LoadingSpinner small />}
        {!loading && (
          <>
            {showIndexText && !mainIndex && (
              <Text tag="p" styleAs="body-s" className={styles.indexContainer__number__description}>
                {t('hankeIndexes:haittaindeksi')}
              </Text>
            )}
            <HaittaIndexNumber index={index} testId={testId} />
          </>
        )}
      </div>
    </div>
  );
};

const getDetourNeedByIndex = (index: IndexProps['index'] | undefined) => {
  if (!index) return '-';
  const staticLocalisationKey = 'hankeIndexes:KIERTOREITTITARPEET:';
  if (index < 3) return `${staticLocalisationKey}EI_TARVETTA`;
  if (index < 4) return `${staticLocalisationKey}TODENNAKOINEN`;
  return `${staticLocalisationKey}MERKITTAVA`;
};

type Props = {
  hankeIndexData: HaittaIndexData | null | undefined;
  indexTitle?: string;
  displayTooltip?: boolean;
  loading?: boolean;
  containerClassName?: string;
  small?: boolean;
};

const HankeIndexes: React.FC<React.PropsWithChildren<Props>> = ({
  hankeIndexData,
  indexTitle,
  displayTooltip,
  loading,
  containerClassName,
  small = false,
}) => {
  const { t } = useTranslation();
  const hankeIndexTitle = indexTitle || t('hankeIndexes:haittaindeksit');
  const liikennehaittaindeksi = hankeIndexData?.liikennehaittaindeksi.indeksi;
  const pyoraliikenneindeksi = hankeIndexData?.pyoraliikenneindeksi;
  const raitioliikenneindeksi = hankeIndexData?.raitioliikenneindeksi;
  const linjaautoliikenneindeksi = hankeIndexData?.linjaautoliikenneindeksi;
  const autoliikenneindeksi = hankeIndexData?.autoliikenneindeksi;

  return (
    <div className={containerClassName}>
      <div className={styles.indexTitle}>
        <Text tag="h3" styleAs="h6" weight="bold">
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
          index={liikennehaittaindeksi}
          testId="test-liikennehaittaindeksi"
          loading={loading}
          mainIndex
          showIndexText={!small}
        />

        <IndexSection
          title={t('hankeIndexes:pyoraliikenne')}
          content={`${t('hankeIndexes:kiertoreittitarve')}: ${t(
            getDetourNeedByIndex(pyoraliikenneindeksi),
          )}`}
          index={pyoraliikenneindeksi}
          testId="test-pyoraliikenneindeksi"
          loading={loading}
          showIndexText={!small}
        />

        <IndexSection
          title={t('hankeIndexes:raitioliikenne')}
          content={`${t('hankeIndexes:kiertoreittitarve')}: ${t(
            getDetourNeedByIndex(raitioliikenneindeksi),
          )}`}
          index={raitioliikenneindeksi}
          testId="test-raitioliikenneindeksi"
          loading={loading}
          showIndexText={!small}
        />

        <IndexSection
          title={t('hankeIndexes:linjaautoliikenne')}
          content={`${t('hankeIndexes:kiertoreittitarve')}: ${t(
            getDetourNeedByIndex(linjaautoliikenneindeksi),
          )}`}
          index={linjaautoliikenneindeksi}
          testId="test-linjaautoliikenneindeksi"
          loading={loading}
          showIndexText={!small}
        />

        <IndexSection
          title={t('hankeIndexes:autoliikenne')}
          content={`${t('hankeIndexes:kiertoreittitarve')}: ${t(
            getDetourNeedByIndex(autoliikenneindeksi),
          )}`}
          index={autoliikenneindeksi}
          testId="test-autoliikenneindeksi"
          loading={loading}
          showIndexText={!small}
        />
        {hankeIndexData === undefined && (
          <p className={styles.indexInfo}>{t('hankeIndexes:indexesNotCalculated')}</p>
        )}
      </div>
    </div>
  );
};

export default HankeIndexes;
