import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { LANGUAGES } from '../types/language';
import useLocale from '../hooks/useLocale';
import Login from '../../domain/auth/components/Login';
import OidcCallback from '../../domain/auth/components/OidcCallback';
import { LOGIN_CALLBACK_PATH, LOGIN_PATH } from '../../domain/auth/constants';
import useAuth from '../../domain/auth/useAuth';
import LocaleRoutes from './LocaleRoutes';

type Props = {
  children: JSX.Element;
};

const PrivateRoute: React.FC<Props> = ({ children }) => {
  const { isAuthenticated, isLoading, isLoaded } = useAuth();

  // Wait for login
  if (!isLoaded || isLoading) {
    return null;
  }

  return isAuthenticated ? children : <Navigate to={LOGIN_PATH} />;
};

const AppRoutes: React.FC = () => {
  const currentLocale = useLocale();

  return (
    <Routes>
      <Route path={LOGIN_PATH} element={<Login />} />
      <Route path={LOGIN_CALLBACK_PATH} element={<OidcCallback />} />
      {Object.values(LANGUAGES).map((locale) => (
        <Route
          path={`/${locale}/*`}
          element={
            <PrivateRoute>
              <LocaleRoutes />
            </PrivateRoute>
          }
          key={locale}
        />
      ))}
      <Route path="*" element={<Navigate to={`/${currentLocale}`} />} />
    </Routes>
  );
};

export default AppRoutes;
