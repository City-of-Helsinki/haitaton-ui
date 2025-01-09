import React, { useEffect } from 'react';
import MainHeading from '../../../common/components/mainHeading/MainHeading';
import Text from '../../../common/components/text/Text';
import { useTranslation } from 'react-i18next';
import { useBreadcrumbs } from './WorkInstructionsPage';
import { BREADCRUMBS } from './Breadcrumbs';

const WorkInstructionsMain: React.FC = () => {
  const { t } = useTranslation();
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    const updateBreadcrumbs = () => setBreadcrumbs([BREADCRUMBS.tyoOhjeet]);

    updateBreadcrumbs();
  }, [setBreadcrumbs]);
  return (
    <>
      <MainHeading spacingBottom="xl">{t('workInstructions:main:header')}</MainHeading>
      <Text tag="p">{t('workInstructions:main:content')}</Text>
    </>
  );
};

export default WorkInstructionsMain;
