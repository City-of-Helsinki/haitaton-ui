import { useTranslation } from 'react-i18next';
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

  return { showSendSuccess };
}
