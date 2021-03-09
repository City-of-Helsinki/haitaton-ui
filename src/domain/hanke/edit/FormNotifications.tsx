import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Notification from './Notification';
import { getShowNotification } from './selectors';

const FormNotifications = () => {
  const { t } = useTranslation();
  const showNotification = useSelector(getShowNotification());

  return (
    <>
      {showNotification === 'success' && (
        <Notification label={t('hankeForm:savingSuccessHeader')} typeProps="success">
          {t('hankeForm:savingSuccessText')}
        </Notification>
      )}
      {showNotification === 'error' && (
        <Notification label={t('hankeForm:savingFailHeader')} typeProps="error">
          {t('hankeForm:savingFailText')}
        </Notification>
      )}
      {showNotification === 'indexSuccess' && (
        <Notification label={t('hankeForm:indexCalculationSuccessHeader')} typeProps="success">
          {t('hankeForm:indexCalculationSuccessText')}
        </Notification>
      )}
      {showNotification === 'indexError' && (
        <Notification label={t('hankeForm:indexCalculationFailHeader')} typeProps="error">
          {t('hankeForm:indexCalculationFailText')}
        </Notification>
      )}
    </>
  );
};

export default FormNotifications;
