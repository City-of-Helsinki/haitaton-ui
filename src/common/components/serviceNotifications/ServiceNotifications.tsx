import { useEffect, useState } from 'react';
import { Notification } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { loadBanners } from '../../../locales/i18n';

enum NotificationType {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
}

const NOTIFICATION_CLOSED = 'notification-closed';

/**
 * Notifications to display for info, warning or error
 * in Haitaton service
 */
function ServiceNotifications() {
  const { t } = useTranslation();
  const [bannersLoaded, setBannersLoaded] = useState(false);
  useEffect(() => {
    let ignore = false;
    loadBanners().then(() => {
      if (!ignore) {
        setBannersLoaded(true);
      }
    });
    return () => {
      ignore = true;
    };
  }, []);

  const infoLabel = t('serviceInfo:label');
  const infoText = t('serviceInfo:text');
  const infoClosed = Boolean(
    sessionStorage.getItem(`${NotificationType.INFO}-${NOTIFICATION_CLOSED}`),
  );
  const [infoOpen, setInfoOpen] = useState(false);

  const warningLabel = t('serviceWarning:label');
  const warningText = t('serviceWarning:text');
  const warningClosed = Boolean(
    sessionStorage.getItem(`${NotificationType.WARNING}-${NOTIFICATION_CLOSED}`),
  );
  const [warningOpen, setWarningOpen] = useState(false);

  const errorLabel = t('serviceError:label');
  const errorText = t('serviceError:text');
  const errorClosed = Boolean(
    sessionStorage.getItem(`${NotificationType.ERROR}-${NOTIFICATION_CLOSED}`),
  );
  const [errorOpen, setErrorOpen] = useState(false);

  useEffect(() => {
    if (bannersLoaded) {
      setInfoOpen(Boolean(infoLabel) && !infoClosed);
      setWarningOpen(Boolean(warningLabel) && !warningClosed);
      setErrorOpen(Boolean(errorLabel) && !errorClosed);
    }
  }, [bannersLoaded, infoLabel, infoClosed, warningLabel, warningClosed, errorLabel, errorClosed]);

  if (!bannersLoaded) {
    return null;
  }

  // Close notification and set correspoding value
  // to session storage, so that notification is not
  // shown again on page refresh
  function closeNotification(notificationType: NotificationType) {
    sessionStorage.setItem(`${notificationType}-${NOTIFICATION_CLOSED}`, 'true');
    if (notificationType === NotificationType.INFO) {
      setInfoOpen(false);
    } else if (notificationType === NotificationType.WARNING) {
      setWarningOpen(false);
    } else if (notificationType === NotificationType.ERROR) {
      setErrorOpen(false);
    }
  }

  return (
    <>
      {infoOpen && (
        <Notification
          label={infoLabel}
          type="info"
          notificationAriaLabel={t('common:components:notification:notification')}
          autoClose={false}
          dismissible
          closeButtonLabelText={`${t('common:components:notification:closeButtonLabelText')}`}
          onClose={() => closeNotification(NotificationType.INFO)}
        >
          {infoText}
        </Notification>
      )}

      {warningOpen && (
        <Notification
          label={warningLabel}
          type="alert"
          notificationAriaLabel={t('common:components:notification:notification')}
          autoClose={false}
          dismissible
          closeButtonLabelText={`${t('common:components:notification:closeButtonLabelText')}`}
          onClose={() => closeNotification(NotificationType.WARNING)}
        >
          {warningText}
        </Notification>
      )}

      {errorOpen && (
        <Notification
          label={errorLabel}
          type="error"
          notificationAriaLabel={t('common:components:notification:notification')}
          autoClose={false}
          dismissible
          closeButtonLabelText={`${t('common:components:notification:closeButtonLabelText')}`}
          onClose={() => closeNotification(NotificationType.ERROR)}
        >
          {errorText}
        </Notification>
      )}
    </>
  );
}

export default ServiceNotifications;
