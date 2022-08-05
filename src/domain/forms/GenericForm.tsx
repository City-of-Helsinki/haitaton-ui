import React from 'react';
import styles from './GenericForm.module.scss';

type Props = {
  children: React.ReactNode;
  pagination: React.ReactNode;
};

const GenericForm: React.FC<Props> = ({ pagination, children }) => {
  return (
    <div className={styles.formWrapper}>
      <div className={styles.pagination}>{pagination}</div>
      <div className={styles.actions}>lomake action buttonit - poista, keskeytä ja tallenna</div>
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default GenericForm;
