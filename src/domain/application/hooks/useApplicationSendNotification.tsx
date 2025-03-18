import { useTranslation } from 'react-i18next';
import { useGlobalNotification } from '../../../common/components/globalNotification/GlobalNotificationContext';

/**
 * Returns functions for showing success notification for sending application
 */
export default function useApplicationSendNotification(isMuutosilmoitus: boolean = false) {
  const { t } = useTranslation();
  const { setNotification } = useGlobalNotification();

  function showSendSuccess() {
    setNotification(true, {
      position: 'top-right',
      dismissible: true,
      autoClose: true,
      autoCloseDuration: 8000,
      label: isMuutosilmoitus
        ? t('muutosilmoitus:notification:sendSuccessLabel')
        : t('hakemus:notifications:sendSuccessLabel'),
      message: isMuutosilmoitus
        ? t('muutosilmoitus:notification:sendSuccessText')
        : t('hakemus:notifications:sendSuccessText'),
      type: 'success',
      closeButtonLabelText: t('common:components:notification:closeButtonLabelText'),
    });
  }

  return { showSendSuccess };
}
