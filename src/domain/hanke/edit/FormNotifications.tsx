import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Notification from './Notification';
import { getShowNotification } from './selectors';

const FormNotifications: React.FC = () => {
  const { t } = useTranslation();
  const showNotification = useSelector(getShowNotification());

  return (
    <>
      {showNotification === 'success' && (
        <Notification
          label={t('hankeForm:savingSuccessHeader')}
          typeProps="success"
          testId="formToastSuccess"
        >
          {t('hankeForm:savingSuccessText')}
        </Notification>
      )}
      {showNotification === 'error' && (
        <Notification
          label={t('hankeForm:savingFailHeader')}
          typeProps="error"
          testId="formToastError"
        >
          {t('hankeForm:savingFailText')}
        </Notification>
      )}
    </>
  );
};

export default FormNotifications;
