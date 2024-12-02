import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'hds-react';
import { useGlobalNotification } from '../../../../common/components/globalNotification/GlobalNotificationContext';

/**
 * Returns functions for showing success and error notifications for sending taydennys
 */
export default function useTaydennysSendNotification() {
  const { t } = useTranslation();
  const { setNotification } = useGlobalNotification();

  function showSendSuccess() {
    setNotification(true, {
      position: 'top-right',
      dismissible: true,
      autoClose: true,
      autoCloseDuration: 8000,
      label: t('taydennys:notifications:sendSuccessLabel'),
      message: t('taydennys:notifications:sendSuccessText'),
      type: 'success',
      closeButtonLabelText: t('common:components:notification:closeButtonLabelText'),
    });
  }

  function showSendError() {
    const sendErrorMessage = (
      <Trans i18nKey="taydennys:notifications:sendErrorText">
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
      label: t('taydennys:notifications:sendErrorLabel'),
      message: sendErrorMessage,
      type: 'error',
      closeButtonLabelText: t('common:components:notification:closeButtonLabelText'),
    });
  }

  return { showSendSuccess, showSendError };
}
