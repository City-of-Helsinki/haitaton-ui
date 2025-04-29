import { Notification } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { useGlobalNotification } from './GlobalNotificationContext';

export default function GlobalNotification() {
  const { t } = useTranslation();
  const { isOpen, options, setNotification } = useGlobalNotification();

  if (!isOpen || options === undefined) {
    return null;
  }

  const {
    message,
    position,
    dismissible,
    displayAutoCloseProgress,
    autoClose,
    autoCloseDuration,
    label,
    type,
    closeButtonLabelText,
  } = options;

  const defaultCloseButtonLabelText = t('common:components:notification:closeButtonLabelText');

  function closeNotification() {
    setNotification(false);
  }

  return (
    <Notification
      position={position || 'top-right'}
      dismissible={dismissible}
      displayAutoCloseProgress={displayAutoCloseProgress}
      autoClose={autoClose}
      autoCloseDuration={autoCloseDuration}
      label={label}
      type={type}
      closeButtonLabelText={closeButtonLabelText || defaultCloseButtonLabelText}
      onClose={closeNotification}
    >
      {message}
    </Notification>
  );
}
