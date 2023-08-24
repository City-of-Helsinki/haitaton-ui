import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormNotification } from '../types';
import Notification from './Notification';

type Props = {
  showNotification: FormNotification;
};

const FormNotifications: React.FC<React.PropsWithChildren<Props>> = ({ showNotification }) => {
  const { t } = useTranslation();

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
