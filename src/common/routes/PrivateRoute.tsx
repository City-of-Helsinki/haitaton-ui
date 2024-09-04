import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { REDIRECT_PATH_KEY } from './constants';
import { useOidcClient } from 'hds-react';
import useIsAuthenticated from '../../domain/auth/useIsAuthenticated';

type Props = {
  element: JSX.Element;
};

const PrivateRoute: React.FC<React.PropsWithChildren<Props>> = ({ element }) => {
  const { login } = useOidcClient();
  const isAuthenticated = useIsAuthenticated();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      sessionStorage.removeItem(REDIRECT_PATH_KEY);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    // If user tries to access private route when not signed in,
    // save URL path to session storage and navigate to login,
    // so that user can be redirected to that route after login
    sessionStorage.setItem(REDIRECT_PATH_KEY, location.pathname);
    login();
    return null;
  }

  return element;
};

export default PrivateRoute;
