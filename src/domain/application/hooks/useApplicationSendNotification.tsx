import React from 'react';
import { Link } from 'hds-react';
import { Trans, useTranslation } from 'react-i18next';
import { useGlobalNotification } from '../../../common/components/globalNotification/GlobalNotificationContext';

/**
 * Returns functions for showing success and error notifications for sending application
 */
export default function useApplicationSendNotification(
  errorMessageKey: string = 'hakemus:notifications:sendErrorText',
) {
  const { t } = useTranslation();
  const { setNotification } = useGlobalNotification();

  function showSendSuccess() {
    setNotification(true, {
      position: 'top-right',
      dismissible: true,
      autoClose: true,
      autoCloseDuration: 8000,
      label: t('hakemus:notifications:sendSuccessLabel'),
      message: t('hakemus:notifications:sendSuccessText'),
      type: 'success',
      closeButtonLabelText: t('common:components:notification:closeButtonLabelText'),
    });
  }

  function showSendError() {
    const sendErrorMessage = (
      <Trans i18nKey={errorMessageKey}>
        <p>
          Hakemus on tallennettu luonnoksena, koska hakemuksen lähettäminen käsittelyyn epäonnistui.
          Yritä lähettämistä myöhemmin uudelleen tai ota yhteyttä Haitattoman tekniseen tukeen
          sähköpostiosoitteessa
          <Link href="mailto:haitatontuki@hel.fi">haitatontuki@hel.fi</Link>.
        </p>
      </Trans>
    );

    setNotification(true, {
      position: 'top-right',
      dismissible: true,
      label: t('hakemus:notifications:sendErrorLabel'),
      message: sendErrorMessage,
      type: 'error',
      closeButtonLabelText: t('common:components:notification:closeButtonLabelText'),
    });
  }

  return { showSendSuccess, showSendError };
}
