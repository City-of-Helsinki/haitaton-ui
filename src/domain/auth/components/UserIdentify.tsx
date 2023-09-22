import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { Navigate, useLocation, useSearchParams } from 'react-router-dom';
import ErrorLoadingText from '../../../common/components/errorLoadingText/ErrorLoadingText';
import { useGlobalNotification } from '../../../common/components/globalNotification/GlobalNotificationContext';
import useLocale from '../../../common/hooks/useLocale';
import { REDIRECT_PATH_KEY } from '../../../common/routes/constants';
import { identifyUser } from '../../hanke/hankeUsers/hankeUsersApi';
import useUser from '../useUser';

function UserIdentify() {
  const { data: user } = useUser();
  const isAuthenticated = Boolean(user?.profile);
  const locale = useLocale();
  const { t } = useTranslation();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const { setNotification } = useGlobalNotification();
  const identifyUserCalled = useRef(false);

  const { mutate, isSuccess, isError } = useMutation(identifyUser);

  useEffect(() => {
    if (!isAuthenticated) {
      sessionStorage.setItem(REDIRECT_PATH_KEY, `${location.pathname}${location.search}`);
    }
  }, [isAuthenticated, location.pathname, location.search]);

  useEffect(() => {
    if (isAuthenticated && id !== null && !identifyUserCalled.current) {
      mutate(id, {
        onSuccess() {
          setNotification(true, {
            label: t('hankeUsers:notifications:userIdentifiedLabel'),
            message: t('hankeUsers:notifications:userIdentifiedText'),
            type: 'success',
            dismissible: true,
            closeButtonLabelText: t('common:components:notification:closeButtonLabelText'),
          });
        },
        onSettled() {
          identifyUserCalled.current = true;
          sessionStorage.removeItem(REDIRECT_PATH_KEY);
        },
      });
    }
  }, [isAuthenticated, id, mutate, setNotification, t]);

  if (isError) {
    return <ErrorLoadingText>{t('hankeUsers:notifications:userIdentifiedError')}</ErrorLoadingText>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (isSuccess) {
    return <Navigate to={`/${locale}`} />;
  }

  return null;
}

export default UserIdentify;
