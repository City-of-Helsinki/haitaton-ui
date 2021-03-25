import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Notification from './Notification';
import { getShowNotification } from './selectors';
import { useLocalizedRoutes } from '../../../common/hooks/useLocalizedRoutes';

type Props = {
  hankeTunnus: string | undefined;
};

const FormNotifications: React.FC<Props> = ({ hankeTunnus }) => {
  const { t } = useTranslation();
  const { MAP } = useLocalizedRoutes();
  const showNotification = useSelector(getShowNotification());
  const history = useHistory();

  // Redirect to map after successful index calculation
  useEffect(() => {
    if (showNotification === 'indexSuccess' && hankeTunnus) {
      setTimeout(() => {
        history.push(`${MAP.path}?hanke=${hankeTunnus}`);
      }, 100);
    }
  }, [showNotification, hankeTunnus]);

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
      {showNotification === 'indexSuccess' && (
        <Notification
          label={t('hankeForm:indexCalculationSuccessHeader')}
          typeProps="success"
          testId="formToastIndexSuccess"
        >
          {t('hankeForm:indexCalculationSuccessText')}
        </Notification>
      )}
      {showNotification === 'indexError' && (
        <Notification
          label={t('hankeForm:indexCalculationFailHeader')}
          typeProps="error"
          testId="formToastIndexError"
        >
          {t('hankeForm:indexCalculationFailText')}
        </Notification>
      )}
    </>
  );
};

export default FormNotifications;
