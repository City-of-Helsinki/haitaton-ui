import React, { useEffect } from 'react';
import Text from '../../../../common/components/text/Text';
import Puff from './Puff';
import AdditionalSummary from './AdditionalSummary';
import styles from './cards.module.scss';
import { useBreadcrumbs } from '../WorkInstructionsPage';
import MainHeading from '../../../../common/components/mainHeading/MainHeading';
import { Trans, useTranslation } from 'react-i18next';
import { BREADCRUMBS } from '../Breadcrumbs';

const Card1Basic: React.FC = () => {
  const { setBreadcrumbs } = useBreadcrumbs();
  const { t } = useTranslation();

  useEffect(() => {
    const updateBreadcrumbs = () =>
      setBreadcrumbs([
        BREADCRUMBS.tyoOhjeet,
        BREADCRUMBS.cardsIndex,
        BREADCRUMBS.card1,
        BREADCRUMBS.basicLevel,
      ]);

    updateBreadcrumbs();
  }, [setBreadcrumbs]);

  return (
    <>
      <MainHeading spacingBottom="xl">{t('workInstructions:cards:1:header')}</MainHeading>
      <Text styleAs="h2" tag="h2" spacingBottom="l">
        {t('workInstructions:cards:basicLevel')}
      </Text>
      <Puff>{t('workInstructions:cards:1:puff')}</Puff>
      <article className={styles.content}>
        <Trans i18nKey="workInstructions:cards:1:content"></Trans>
      </article>
      <AdditionalSummary>{t('workInstructions:cards:1:additionalLevelSummary')}</AdditionalSummary>
    </>
  );
};

const Card1Additional: React.FC = () => {
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    const updateBreadcrumbs = () =>
      setBreadcrumbs([BREADCRUMBS.cardsIndex, BREADCRUMBS.card1, BREADCRUMBS.additionalLevel]);

    updateBreadcrumbs();
  }, [setBreadcrumbs]);

  return (
    <>
      <h1>Card 1 Additional</h1>
    </>
  );
};

export { Card1Basic, Card1Additional };
