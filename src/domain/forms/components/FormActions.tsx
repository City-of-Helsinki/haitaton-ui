import React from 'react';
import { useFormikContext } from 'formik';
import { Button, IconCross, IconSaveDiskette, IconTrash } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { HakemusFormValues } from '../../hanke/newForm/types';
import styles from './FormActions.module.scss';

interface Props extends React.HTMLProps<HTMLDivElement> {
  onDelete: () => void;
  onClose: () => void;
  onSave: () => void;
}

const FormActions: React.FC<Props> = ({ onDelete, onClose, onSave }) => {
  const { t } = useTranslation();
  const { values } = useFormikContext<HakemusFormValues>();

  return (
    <div className={styles.actions}>
      {values.hankeTunnus && (
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
      <Button theme="coat" iconLeft={<IconSaveDiskette aria-hidden="true" />} onClick={onSave}>
        {t('hankeForm:saveDraftButton')}
      </Button>
    </div>
  );
};

export default FormActions;
