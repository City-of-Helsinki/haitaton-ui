import { Card } from 'hds-react';
import React from 'react';
import Idea from '../../../../common/components/icons/Idea';
import styles from './cards.module.scss';

const Puff: React.FC<React.PropsWithChildren<{ children?: React.ReactNode }>> = ({ children }) => {
  return (
    <div className={styles.puffcontainer}>
      <Card
        theme={{
          '--background-color': 'var(--color-info-light',
          '--padding-horizontal': 'var(--spacing-l)',
          '--padding-vertical': 'var(--spacing-m)',
        }}
      >
        <div className={styles.puff}>
          <div>
            <div className={styles.icon}>
              <Idea />
            </div>
          </div>
          <div className={styles.puffcontent}>{children}</div>
        </div>
      </Card>
    </div>
  );
};

export default Puff;
