import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { LANGUAGES } from '../types/language';
import useLocale from '../hooks/useLocale';
import Login from '../../domain/auth/components/Login';
import OidcCallback from '../../domain/auth/components/OidcCallback';
import { LOGIN_CALLBACK_PATH, LOGIN_PATH } from '../../domain/auth/constants';
import LocaleRoutes from './LocaleRoutes';

const AppRoutes: React.FC<React.PropsWithChildren<unknown>> = () => {
  const currentLocale = useLocale();

  return (
    <Routes>
      <Route path={LOGIN_PATH} element={<Login />} />
      <Route path={LOGIN_CALLBACK_PATH} element={<OidcCallback />} />
      {Object.values(LANGUAGES).map((locale) => (
        <Route path={`/${locale}/*`} element={<LocaleRoutes />} key={locale} />
      ))}
      <Route path="*" element={<Navigate to={`/${currentLocale}`} />} />
    </Routes>
  );
};

export default AppRoutes;
