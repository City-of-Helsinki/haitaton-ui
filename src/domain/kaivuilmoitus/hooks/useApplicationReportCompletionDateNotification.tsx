import React from 'react';
import { Link } from 'hds-react';
import { Trans, useTranslation } from 'react-i18next';
import { useGlobalNotification } from '../../../common/components/globalNotification/GlobalNotificationContext';

/**
 * Returns functions for showing success and error notifications for reporting completion date for an application.
 */
export default function useApplicationReportCompletionDateNotification(
  messageKey: string,
  errorMessageKey: string = 'hakemus:notifications:reportCompletionDateErrorText',
) {
  const { t } = useTranslation();
  const { setNotification } = useGlobalNotification();

  function showSuccess() {
    setNotification(true, {
      position: 'top-right',
      dismissible: true,
      autoClose: true,
      autoCloseDuration: 8000,
      label: t('hakemus:notifications:reportCompletionDateSuccessLabel'),
      message: t(messageKey),
      type: 'success',
      closeButtonLabelText: t('common:components:notification:closeButtonLabelText'),
    });
  }

  function showError() {
    const errorMessage = (
      <Trans i18nKey={errorMessageKey}>
        <p>
          Lähettämisessä tapahtui virhe. Yritä myöhemmin uudelleen tai ota yhteyttä Haitattoman
          tekniseen tukeen sähköpostiosoitteessa
          <Link href="mailto:haitatontuki@hel.fi">haitatontuki@hel.fi</Link>.
        </p>
      </Trans>
    );

    setNotification(true, {
      position: 'top-right',
      dismissible: true,
      autoClose: true,
      autoCloseDuration: 8000,
      label: t('hakemus:notifications:reportCompletionDateErrorLabel'),
      message: errorMessage,
      type: 'error',
      closeButtonLabelText: t('common:components:notification:closeButtonLabelText'),
    });
  }

  return {
    showReportCompletionDateSuccess: showSuccess,
    showReportCompletionDateError: showError,
  };
}
