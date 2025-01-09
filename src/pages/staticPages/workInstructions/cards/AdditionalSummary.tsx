import { Button, Card } from 'hds-react';
import React from 'react';
import styles from './cards.module.scss';
import { useTranslation } from 'react-i18next';

const AdditionalSummary: React.FC<React.PropsWithChildren<{ children?: React.ReactNode }>> = ({
  children,
}) => {
  const { t } = useTranslation();
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
        onClick={() => {
          window.open('/fi/tyoohjeet/haittojenhallinta/1/lisataso');
        }}
      >
        {t('workInstructions:cards:readMore')}
      </Button>
    </Card>
  );
};

export default AdditionalSummary;
