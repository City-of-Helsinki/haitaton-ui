import { Card } from 'hds-react';
import React from 'react';
import Idea from '../../../../common/components/icons/Idea';

const Puff: React.FC<React.PropsWithChildren<{ children?: React.ReactNode }>> = ({ children }) => {
  return (
    <Card
      theme={{
        '--background-color': 'var(--color-info-light',
        '--padding-horizontal': 'var(--spacing-l)',
        '--padding-vertical': 'var(--spacing-m)',
      }}
    >
      <div style={{ width: '128px', height: '128px' }}>
        <Idea />
      </div>
      <div>{children}</div>
    </Card>
  );
};

export default Puff;
