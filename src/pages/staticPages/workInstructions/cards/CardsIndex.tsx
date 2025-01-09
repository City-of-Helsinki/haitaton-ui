import React, { useEffect } from 'react';
import MainHeading from '../../../../common/components/mainHeading/MainHeading';
import Text from '../../../../common/components/text/Text';
import { useBreadcrumbs } from '../WorkInstructionsPage';
import { useTranslation } from 'react-i18next';
import { BREADCRUMBS } from '../Breadcrumbs';

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
      <Text tag="p">{t('workInstructions:cardsIndex:content')}</Text>
    </>
  );
};

export default CardsIndex;
