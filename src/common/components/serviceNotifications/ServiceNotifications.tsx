import React, { useState } from 'react';
import { Notification } from 'hds-react';
import { useTranslation } from 'react-i18next';

/**
 * Notifications to display for warning or error
 * in Haitaton service
 */
function ServiceNotifications() {
  const { t } = useTranslation();

  const warningLabel = t('serviceWarning:label');
  const warningText = t('serviceWarning:text');
  const [warningOpen, setWarningOpen] = useState(Boolean(warningLabel));

  const errorLabel = t('serviceError:label');
  const errorText = t('serviceError:text');
  const [errorOpen, setErrorOpen] = useState(Boolean(errorLabel));

  return (
    <>
      {warningOpen && (
        <Notification
          label={warningLabel}
          type="alert"
          notificationAriaLabel={t('common:components:notification:notification')}
          autoClose={false}
          dismissible
          closeButtonLabelText={`${t('common:components:notification:closeButtonLabelText')}`}
          onClose={() => setWarningOpen(false)}
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
          onClose={() => setErrorOpen(false)}
        >
          {errorText}
        </Notification>
      )}
    </>
  );
}

export default ServiceNotifications;
