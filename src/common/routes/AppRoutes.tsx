import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { LANGUAGES } from '../types/language';
import useLocale from '../hooks/useLocale';
import OidcCallback from '../../domain/auth/components/OidcCallback';
import { LOGIN_CALLBACK_PATH } from '../../domain/auth/constants';
import LocaleRoutes from './LocaleRoutes';
import { REDIRECT_PATH_KEY } from './constants';

const AppRoutes: React.FC<React.PropsWithChildren<unknown>> = () => {
  const currentLocale = useLocale();
  const redirectPath = sessionStorage.getItem(REDIRECT_PATH_KEY);

  return (
    <Routes>
      <Route path={LOGIN_CALLBACK_PATH} element={<OidcCallback />} />
      {Object.values(LANGUAGES).map((locale) => (
        <Route path={`/${locale}/*`} element={<LocaleRoutes />} key={locale} />
      ))}
      <Route
        path="*"
        element={<Navigate to={redirectPath ? redirectPath : `/${currentLocale}`} />}
      />
    </Routes>
  );
};

export default AppRoutes;
