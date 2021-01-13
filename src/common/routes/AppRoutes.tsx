import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { LANGUAGES } from '../types/language';
import useLocale from '../hooks/useLocale';
import Login from '../../domain/auth/components/Login';
import LoginCallback from '../../domain/auth/components/LoginCallback';
import LocaleRoutes from './LocaleRoutes';

const localeParam = `:locale(${Object.values(LANGUAGES).join('|')})`;

const AppRoutes: React.FC = () => {
  const currentLocale = useLocale();

  return (
    <Switch>
      <Redirect exact path="/" to={`/${currentLocale}`} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/callback" component={LoginCallback} />
      <Route path={`/${localeParam}`} component={LocaleRoutes} />
      <Route render={() => <Redirect to={`/${currentLocale}`} />} />
    </Switch>
  );
};

export default AppRoutes;
