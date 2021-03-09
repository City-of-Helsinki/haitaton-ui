import React from 'react';
import { StatusLabel } from 'hds-react';
import { useTranslation } from 'react-i18next';
import Text from '../../../../common/components/text/Text';
import styles from './HankeIndexes.module.scss';

type IndexProps = {
  title: string;
  content?: string;
  index: number;
};

const IndexSection: React.FC<IndexProps> = ({ title, content, index }) =>
  title && title !== '' && index ? (
    <>
      <div className={styles.indexContainer}>
        <div className={styles.indexContainer__titlesContainer}>
          <Text tag="h3" styleAs={content ? 'h6' : 'h5'} weight="bold">
            {title}
          </Text>
          {content && (
            <Text tag="p" styleAs="body-m">
              {content}
            </Text>
          )}
        </div>
        <div className={styles.indexContainer__statusContainer}>
          <StatusLabel type="alert">{index}</StatusLabel>
        </div>
      </div>
    </>
  ) : null;

type Props = {
  hankeTunnus: string; // FIXME
};

const HankeIndexes: React.FC<Props> = ({ hankeTunnus }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.indexes}>
      <h1>{hankeTunnus}</h1>

      <IndexSection title={t('hankeIndexes:liikennehaittaindeksi')} index={4} />

      <IndexSection
        title={t('hankeIndexes:ruuhkautuminen')}
        content={`${t('hankeIndexes:kiertoreittitarve')}: ${t('hankeIndexes:todennakoinen')}`}
        index={2.7}
      />

      <IndexSection
        title={t('hankeIndexes:pyorailynPaareitti')}
        content={`${t('hankeIndexes:kiertoreittitarve')}: ${t('hankeIndexes:eiTarvetta')}`}
        index={1}
      />

      <IndexSection
        title={t('hankeIndexes:merkittavatJoukkoliikennereitit')}
        content={`${t('hankeIndexes:kiertoreittitarve')}: ${t('hankeIndexes:merkittava')}`}
        index={4}
      />
    </div>
  );
};

export default HankeIndexes;
