import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import useUser from '../../domain/auth/useUser';
import { REDIRECT_PATH_KEY } from './constants';

type Props = {
  element: JSX.Element;
};

const PrivateRoute: React.FC<React.PropsWithChildren<Props>> = ({ element }) => {
  const { data: user } = useUser();
  const isAuthenticated = Boolean(user?.profile);

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
    return <Navigate to="/login" />;
  }

  return element;
};

export default PrivateRoute;
