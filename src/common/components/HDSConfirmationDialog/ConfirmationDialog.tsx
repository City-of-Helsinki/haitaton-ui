import React from 'react';
import {
  Dialog,
  DialogVariant,
  Notification,
  ButtonVariant,
  ButtonPresetTheme,
  NotificationSize,
} from 'hds-react';
import { IconAlertCircleFill } from 'hds-react/icons';
import { useTranslation } from 'react-i18next';
import { Box } from '@chakra-ui/react';
import Button from '../button/Button';

type Props = {
  title: string;
  description: string | React.ReactNode;
  isOpen: boolean;
  close?: () => void;
  mainAction: () => void;
  mainBtnLabel?: string;
  mainBtnIcon?: React.ReactElement;
  variant: DialogVariant;
  errorMsg?: string;
  showCloseButton?: boolean;
  showSecondaryButton?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  headerIcon?: React.ReactNode;
  disabled?: boolean;
};

const ConfirmationDialog: React.FC<React.PropsWithChildren<Props>> = ({
  title,
  description,
  isOpen,
  close,
  mainAction,
  mainBtnLabel,
  mainBtnIcon,
  variant,
  errorMsg,
  showCloseButton = false,
  showSecondaryButton = true,
  isLoading = false,
  loadingText = mainBtnLabel,
  headerIcon = (
    <IconAlertCircleFill
      aria-hidden="true"
      color={variant === 'primary' ? 'var(--color-bus)' : 'var(--color-brick)'}
    />
  ),
  disabled = false,
}) => {
  const { t } = useTranslation();

  const mainButton = (
    <Button
      onClick={mainAction}
      data-testid="dialog-button-test"
      variant={variant === 'danger' ? ButtonVariant.Danger : ButtonVariant.Primary}
      iconStart={mainBtnIcon}
      disabled={disabled}
      isLoading={isLoading}
      loadingText={loadingText}
    >
      {mainBtnLabel ?? t('common:confirmationDialog:confirmButton')}
    </Button>
  );

  const secondaryButton = showSecondaryButton && (
    <Button
      variant={ButtonVariant.Secondary}
      onClick={close}
      theme={variant === 'danger' ? ButtonPresetTheme.Black : undefined}
      data-testid="dialog-cancel-test"
      disabled={disabled}
    >
      {t('common:confirmationDialog:cancelButton')}
    </Button>
  );

  return (
    <Dialog
      id="dialog"
      isOpen={isOpen}
      aria-labelledby={title}
      aria-describedby={typeof description === 'string' ? description : title}
      targetElement={document.getElementById('root') || undefined}
      variant={variant}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      close={showCloseButton ? (close as any) : undefined}
      closeButtonLabelText={t('common:ariaLabels:closeButtonLabelText')}
    >
      <Dialog.Header id="dialog-title" title={title} iconStart={headerIcon} />
      <Dialog.Content>
        {typeof description === 'string' ? (
          <p data-testid="dialog-description-test">{description}</p>
        ) : (
          <div data-testid="dialog-description-test">{description}</div>
        )}
        {errorMsg && (
          <Box paddingTop="var(--spacing-s)">
            <Notification type="error" size={NotificationSize.Small} label={errorMsg}>
              {errorMsg}
            </Notification>
          </Box>
        )}
      </Dialog.Content>
      <Dialog.ActionButtons>
        {variant === 'danger' ? (
          <>
            {secondaryButton}
            {mainButton}
          </>
        ) : (
          <>
            {mainButton}
            {secondaryButton}
          </>
        )}
      </Dialog.ActionButtons>
    </Dialog>
  );
};
export default ConfirmationDialog;
