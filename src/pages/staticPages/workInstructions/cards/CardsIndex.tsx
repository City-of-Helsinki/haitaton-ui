import React, { useEffect } from 'react';
import MainHeading from '../../../../common/components/mainHeading/MainHeading';
import Text from '../../../../common/components/text/Text';
import { useTranslation } from 'react-i18next';
import { BREADCRUMBS, useBreadcrumbs } from '../../Breadcrumbs';
import styles from './cards.module.scss';

const CardsIndex: React.FC = () => {
  const { setBreadcrumbs } = useBreadcrumbs();
  const { t } = useTranslation();

  useEffect(() => {
    const updateBreadcrumbs = () => setBreadcrumbs([BREADCRUMBS.tyoOhjeet, BREADCRUMBS.cardsIndex]);

    updateBreadcrumbs();
  }, [setBreadcrumbs]);

  return (
    <>
      <MainHeading spacingBottom="xl">{t('workInstructions:cardsIndex:header')}</MainHeading>
      <div className={styles.content}>
        <Text tag="p">{t('workInstructions:cardsIndex:content')}</Text>
      </div>
    </>
  );
};

export default CardsIndex;
