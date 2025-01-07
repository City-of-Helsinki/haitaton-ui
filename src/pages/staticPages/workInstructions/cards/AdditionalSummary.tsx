import { Button, Card } from 'hds-react';
import React from 'react';

const AdditionalSummary: React.FC<React.PropsWithChildren<{ children?: React.ReactNode }>> = ({
  children,
}) => {
  return (
    <Card
      heading="Mahdollinen lisätaso"
      theme={{
        '--background-color': 'var(--color-black-5)',
        '--padding-horizontal': 'var(--spacing-l)',
        '--padding-vertical': 'var(--spacing-m)',
      }}
    >
      {children}
      <Button variant="secondary" theme="black" role="link">
        Lue lisää
      </Button>
    </Card>
  );
};

export default AdditionalSummary;
