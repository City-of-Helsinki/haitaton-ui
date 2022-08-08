import React from 'react';
import FormActions from './components/FormActions';
import styles from './GenericForm.module.scss';

type Props = {
  children: React.ReactNode;
  pagination: React.ReactNode;
  onDelete: () => void;
  onClose: () => void;
  onSave: () => void;
};

const GenericForm: React.FC<Props> = ({ pagination, children, onDelete, onClose, onSave }) => {
  return (
    <div className={styles.formWrapper}>
      <div className={styles.pagination}>{pagination}</div>
      <FormActions onDelete={onDelete} onClose={onClose} onSave={onSave} />
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default GenericForm;
