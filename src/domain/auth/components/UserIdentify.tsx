import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { Navigate, useLocation, useSearchParams } from 'react-router-dom';
import { LoadingSpinner, useOidcClient } from 'hds-react';
import { Flex } from '@chakra-ui/react';
import ErrorLoadingText from '../../../common/components/errorLoadingText/ErrorLoadingText';
import { useGlobalNotification } from '../../../common/components/globalNotification/GlobalNotificationContext';
import useLocale from '../../../common/hooks/useLocale';
import { REDIRECT_PATH_KEY } from '../../../common/routes/constants';
import { identifyUser } from '../../hanke/hankeUsers/hankeUsersApi';
import useIsAuthenticated from '../useIsAuthenticated';

function UserIdentify() {
  const { login } = useOidcClient();
  const isAuthenticated = useIsAuthenticated();
  const locale = useLocale();
  const { t } = useTranslation();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const { setNotification } = useGlobalNotification();
  const identifyUserCalled = useRef(false);

  const { mutate, isSuccess, isError, isLoading } = useMutation(identifyUser, { retry: 2 });

  useEffect(() => {
    if (!isAuthenticated) {
      sessionStorage.setItem(REDIRECT_PATH_KEY, `${location.pathname}${location.search}`);
    }
  }, [isAuthenticated, location.pathname, location.search]);

  useEffect(() => {
    if (isAuthenticated && id !== null && !identifyUserCalled.current) {
      mutate(id, {
        onSuccess({ hankeNimi, hankeTunnus }) {
          setNotification(true, {
            label: t('hankeUsers:notifications:userIdentifiedLabel'),
            message: t('hankeUsers:notifications:userIdentifiedText', { hankeNimi, hankeTunnus }),
            type: 'success',
            dismissible: true,
            closeButtonLabelText: t('common:components:notification:closeButtonLabelText'),
            autoClose: true,
            autoCloseDuration: 30000,
          });
        },
        onSettled() {
          identifyUserCalled.current = true;
          sessionStorage.removeItem(REDIRECT_PATH_KEY);
        },
      });
    }
  }, [isAuthenticated, id, mutate, setNotification, t]);

  if (isLoading) {
    return (
      <Flex justify="center" mt="var(--spacing-xl)">
        <LoadingSpinner />
      </Flex>
    );
  }

  if (isError) {
    return <ErrorLoadingText>{t('hankeUsers:notifications:userIdentifiedError')}</ErrorLoadingText>;
  }

  if (!isAuthenticated) {
    login();
    return null;
  }

  if (isSuccess) {
    return <Navigate to={`/${locale}`} />;
  }

  return null;
}

export default UserIdentify;
