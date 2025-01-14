import React, { useEffect } from 'react';
import Text from '../../../../common/components/text/Text';
import Puff from './Puff';
import AdditionalSummary from './AdditionalSummary';
import styles from './cards.module.scss';
import { useBreadcrumbs } from '../WorkInstructionsPage';
import MainHeading from '../../../../common/components/mainHeading/MainHeading';
import { Trans, useTranslation } from 'react-i18next';
import { BREADCRUMBS } from '../Breadcrumbs';
import { useParams } from 'react-router-dom';
import { BreadcrumbListItem } from 'hds-react';

function Card1Basic() {
  const { t } = useTranslation();

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
}

const Card1Additional: React.FC = () => {
  return (
    <>
      <h1>Card 1 Additional</h1>
    </>
  );
};

const Card: React.FC = () => {
  const { number = '', type = '' } = useParams<{ number: string; type: string }>();
  const { setBreadcrumbs } = useBreadcrumbs();
  const { t } = useTranslation();

  useEffect(() => {
    const breadcrumb: BreadcrumbListItem = {
      title: `workInstructions:cards:${number}:header`,
      path: '',
    };

    const updateBreadcrumbs = () =>
      setBreadcrumbs([BREADCRUMBS.cardsIndex, breadcrumb, BREADCRUMBS.basicLevel]);

    updateBreadcrumbs();
  }, [setBreadcrumbs, number, type]);

  const renderCard = (cardNumber: string) => {
    switch (cardNumber) {
      case '1':
        return type === t('routes:CARD:basicLevel') ? <Card1Basic /> : <Card1Additional />;
      /*case '2':
        return type === 'basic' ? <Card2Basic /> : <Card2Additional />;
      case '3':
        return type === 'basic' ? <Card3Basic /> : <Card3Additional />;
      case '4':
        return type === 'basic' ? <Card4Basic /> : <Card4Additional />;
      case '5':
        return type === 'basic' ? <Card5Basic /> : <Card5Additional />;
      case '6':
        return type === 'basic' ? <Card6Basic /> : <Card6Additional />;
      case '7':
        return type === 'basic' ? <Card7Basic /> : <Card7Additional />;
      case '8':
        return type === 'basic' ? <Card8Basic /> : <Card8Additional />;
      case '9':
        return type === 'basic' ? <Card9Basic /> : <Card9Additional />;
      case '10':
        return type === 'basic' ? <Card10Basic /> : <Card10Additional />;*/
      default:
        return <div>{t('workInstructions:cards:notFound')}</div>;
    }
  };

  return <>{renderCard(number)}</>;
};

export { Card1Basic, Card1Additional, Card };
