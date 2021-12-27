import React from 'react';
import { Dialog, Button } from 'hds-react';
import { IconAlertCircle } from 'hds-react/icons';
import { useTranslation } from 'react-i18next';

type Props = {
  title: string;
  description: string;
  isOpen: boolean;
  close: () => void;
  mainAction: () => void;
  mainBtnLabel: string;
};

const ConfirmationDialog: React.FC<Props> = ({
  title,
  description,
  isOpen,
  close,
  mainAction,
  mainBtnLabel,
}) => {
  const { t } = useTranslation();

  return (
    <Dialog
      id="dialog"
      isOpen={isOpen}
      aria-labelledby={title}
      aria-describedby={description}
      targetElement={document.getElementById('root') || undefined}
      theme={{ '--accent-line-color': '#0072C6' }}
    >
      <Dialog.Header
        id="dialog-title"
        title={title}
        iconLeft={<IconAlertCircle aria-hidden="true" />}
      />
      <Dialog.Content>
        <p data-testid="dialog-description-test">{description}</p>
      </Dialog.Content>
      <Dialog.ActionButtons>
        <Button onClick={() => mainAction()} theme="coat" data-testid="dialog-button-test">
          {mainBtnLabel}
        </Button>
        <Button
          variant="secondary"
          onClick={() => close()}
          theme="coat"
          data-testid="dialog-cancel-test"
        >
          {t('common:confirmationDialog:cancelButton')}
        </Button>
      </Dialog.ActionButtons>
    </Dialog>
  );
};
export default ConfirmationDialog;
