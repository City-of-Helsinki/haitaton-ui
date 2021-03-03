import React, { useEffect, useState } from 'react';
import { RouteChildrenProps } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import authService from '../authService';

type AuthenticationError = 'deviceTimeError' | 'permissionDeniedByUserError' | 'unknown';

const OidcCallback: React.FC<RouteChildrenProps> = ({ history }) => {
  const { t } = useTranslation();
  const [authenticationError, setAuthenticationError] = useState<AuthenticationError | null>(null);

  useEffect(() => {
    authService
      .endLogin()
      .then(() => {
        history.replace('/');
      })
      .catch((error: Error) => {
        // Handle error caused by device time being more than 5 minutes off
        if (
          error.message.includes('iat is in the future') ||
          error.message.includes('exp is in the past')
        ) {
          setAuthenticationError('deviceTimeError');
        } else if (
          // Handle error caused by end user choosing Deny in Tunnistamo's
          // permission request
          error.message === 'The resource owner or authorization server denied the request'
        ) {
          setAuthenticationError('permissionDeniedByUserError');
        } else {
          // Give user a generic error
          setAuthenticationError('unknown');
        }
      });
  }, [history, t]);

  return (
    <>
      {authenticationError === 'deviceTimeError' && <p>{t('authentication.deviceTimeError')}</p>}
      {authenticationError === 'permissionDeniedByUserError' && (
        <p>{t('authentication.permissionRequestDenied')}</p>
      )}
      {authenticationError === 'unknown' && <p>{t('authentication.genericError')}</p>}
    </>
  );
};

export default OidcCallback;
