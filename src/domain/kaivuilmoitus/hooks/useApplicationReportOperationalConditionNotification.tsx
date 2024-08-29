import React from 'react';
import { Link } from 'hds-react';
import { Trans, useTranslation } from 'react-i18next';
import { useGlobalNotification } from '../../../common/components/globalNotification/GlobalNotificationContext';

/**
 * Returns functions for showing success and error notifications for reporting application in operational condition.
 */
export default function useApplicationReportOperationalConditionNotification(
  errorMessageKey: string = 'hakemus:notifications:reportOperationalConditionErrorText',
) {
  const { t } = useTranslation();
  const { setNotification } = useGlobalNotification();

  function showSuccess() {
    setNotification(true, {
      position: 'top-right',
      dismissible: true,
      autoClose: true,
      autoCloseDuration: 8000,
      label: t('hakemus:notifications:reportOperationalConditionSuccessLabel'),
      message: t('hakemus:notifications:reportOperationalConditionSuccessText'),
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
      label: t('hakemus:notifications:reportOperationalConditionErrorLabel'),
      message: errorMessage,
      type: 'error',
      closeButtonLabelText: t('common:components:notification:closeButtonLabelText'),
    });
  }

  return {
    showReportOperationalConditionSuccess: showSuccess,
    showReportOperationalConditionError: showError,
  };
}
