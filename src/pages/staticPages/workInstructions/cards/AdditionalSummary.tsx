import { Button, Card } from 'hds-react';
import React from 'react';
import styles from './cards.module.scss';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useLocalizedRoutes } from '../../../../common/hooks/useLocalizedRoutes';

const AdditionalSummary: React.FC<React.PropsWithChildren<{ children?: React.ReactNode }>> = ({
  children,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { number = '' } = useParams<{ number: string }>();
  const { CARD } = useLocalizedRoutes();

  return (
    <Card
      heading="Mahdollinen lisätaso"
      style={{ width: '100%' }}
      theme={{
        '--background-color': 'var(--color-black-5)',
        '--padding-horizontal': 'var(--spacing-l)',
        '--padding-vertical': 'var(--spacing-m)',
      }}
    >
      <div className={styles.additionalsummary}>{children}</div>
      <Button
        variant="secondary"
        theme="black"
        role="link"
        onClick={(e) => {
          e.preventDefault();
          navigate(t(`${CARD.path}${number}/${t('routes:CARD:additionalLevel')}`));
        }}
      >
        {t('workInstructions:cards:readMore')}
      </Button>
    </Card>
  );
};

export default AdditionalSummary;
