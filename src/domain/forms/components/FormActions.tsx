import React from 'react';
import { Button, IconCross, IconSaveDiskette, IconTrash } from 'hds-react';
import { useTranslation } from 'react-i18next';
import styles from './FormActions.module.scss';

interface Props extends React.HTMLProps<HTMLDivElement> {
  showDelete?: boolean;
  isFormValid?: boolean;
  onDelete: () => void;
  onClose: () => void;
  onSave: () => void;
}

const FormActions: React.FC<Props> = ({ showDelete, isFormValid, onDelete, onClose, onSave }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.actions}>
      {showDelete && (
        <Button
          className={styles.deleteHankeBtn}
          variant="supplementary"
          iconLeft={<IconTrash aria-hidden />}
          onClick={onDelete}
        >
          {t('hankeList:buttons:delete')}
        </Button>
      )}
      <Button
        theme="coat"
        variant="supplementary"
        iconLeft={<IconCross aria-hidden="true" />}
        onClick={onClose}
      >
        {t('hankeForm:cancelButton')}
      </Button>
      <Button
        disabled={!isFormValid}
        theme="coat"
        iconLeft={<IconSaveDiskette aria-hidden="true" />}
        onClick={onSave}
        data-testid="save-form-btn"
      >
        {t('hankeForm:saveDraftButton')}
      </Button>
    </div>
  );
};

export default FormActions;
