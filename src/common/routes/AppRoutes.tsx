import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { LANGUAGES } from '../constants/languages';
import useLocale from '../hooks/useLocale';
import LocaleRoutes from './LocaleRoutes';

const localeParam = `:locale(${Object.values(LANGUAGES).join('|')})`;

const AppRoutes: React.FC = () => {
  const currentLocale = useLocale();

  return (
    <Switch>
      <Redirect exact path="/" to={`/${currentLocale}`} />
      <Route path={`/${localeParam}`} component={LocaleRoutes} />
      <Route
        render={(props) => (
          <Redirect to={`/${currentLocale}${props.location.pathname}${props.location.search}`} />
        )}
      />
    </Switch>
  );
};

export default AppRoutes;
