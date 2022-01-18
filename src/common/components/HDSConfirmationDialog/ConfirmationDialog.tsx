import React from 'react';
import { Dialog, Button } from 'hds-react';
import { IconAlertCircle, IconErrorFill } from 'hds-react/icons';
import { useTranslation } from 'react-i18next';

import styles from './ConfirmationDialog.module.scss';

type Props = {
  title: string;
  description: string;
  isOpen: boolean;
  close: () => void;
  mainAction: () => void;
  mainBtnLabel: string;
  variant: string;
  errorMsg?: string;
};

const ConfirmationDialog: React.FC<Props> = ({
  title,
  description,
  isOpen,
  close,
  mainAction,
  mainBtnLabel,
  variant,
  errorMsg,
}) => {
  const { t } = useTranslation();

  return (
    <Dialog
      id="dialog"
      isOpen={isOpen}
      aria-labelledby={title}
      aria-describedby={description}
      targetElement={document.getElementById('root') || undefined}
      theme={
        variant === 'danger'
          ? { '--accent-line-color': '#c4123e' }
          : { '--accent-line-color': '#0072C6' }
      }
    >
      <Dialog.Header
        id="dialog-title"
        title={title}
        iconLeft={<IconAlertCircle aria-hidden="true" />}
      />
      <Dialog.Content>
        <p data-testid="dialog-description-test">{description}</p>
        {errorMsg && (
          <div className={styles.errorMsg}>
            <IconErrorFill />
            <p>{errorMsg}</p>
          </div>
        )}
      </Dialog.Content>
      <Dialog.ActionButtons>
        {variant === 'primary' ? (
          <Button onClick={() => mainAction()} theme="coat" data-testid="dialog-button-test">
            {mainBtnLabel}
          </Button>
        ) : (
          ''
        )}
        <Button
          variant="secondary"
          onClick={() => close()}
          theme={variant === 'danger' ? 'black' : 'coat'}
          data-testid="dialog-cancel-test"
        >
          {t('common:confirmationDialog:cancelButton')}
        </Button>
        {variant === 'danger' ? (
          <Button variant="danger" onClick={() => mainAction()} data-testid="dialog-button-test">
            {mainBtnLabel}
          </Button>
        ) : (
          ''
        )}
      </Dialog.ActionButtons>
    </Dialog>
  );
};
export default ConfirmationDialog;
