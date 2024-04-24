import { Notification } from 'hds-react';
import { useTranslation } from 'react-i18next';

export default function UserDeleteNotification({
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
      autoCloseDuration={4000}
      type="success"
      label={t('hankeUsers:notifications:userDeletedLabel')}
      closeButtonLabelText={t('common:components:notification:closeButtonLabelText')}
      onClose={onClose}
    >
      {t('hankeUsers:notifications:userDeletedText')}
    </Notification>
  );
}
