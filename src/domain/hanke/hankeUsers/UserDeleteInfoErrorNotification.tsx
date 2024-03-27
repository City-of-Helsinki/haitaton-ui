import { Notification } from 'hds-react';
import { useTranslation } from 'react-i18next';

export default function UserDeleteInfoErrorNotification({
  onClose,
}: Readonly<{
  onClose: () => void;
}>) {
  const { t } = useTranslation();
  return (
    <Notification
      position="top-right"
      dismissible
      autoClose
      autoCloseDuration={7000}
      type="error"
      label={t('common:error')}
      closeButtonLabelText={t('common:components:notification:closeButtonLabelText')}
      onClose={onClose}
      size="small"
    >
      {t('common:error')}
    </Notification>
  );
}
