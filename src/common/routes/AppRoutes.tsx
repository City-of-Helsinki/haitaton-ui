import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { LANGUAGES } from '../types/language';
import useLocale from '../hooks/useLocale';
import Login from '../../domain/auth/components/Login';
import OidcCallback from '../../domain/auth/components/OidcCallback';
import { LOGIN_CALLBACK_PATH, LOGIN_PATH } from '../../domain/auth/constants';
import useAuth from '../../domain/auth/useAuth';
import LocaleRoutes from './LocaleRoutes';

const localeParam = `:locale(${Object.values(LANGUAGES).join('|')})`;

type Props = {
  path: string;
  component: React.ElementType;
};

const PrivateRoute: React.FC<Props> = ({ component: Component, ...rest }) => {
  const { isAuthenticated } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) => (
        <div>
          {!isAuthenticated && <p data-testid="should-login-text">Kirjaudu sisään</p>}
          <Component {...props} />
        </div>
      )}
    />
  );
};

const AppRoutes: React.FC = () => {
  const currentLocale = useLocale();

  return (
    <Switch>
      <Redirect exact path="/" to={`/${currentLocale}`} />
      <Route exact path={LOGIN_PATH} component={Login} />
      <Route exact path={LOGIN_CALLBACK_PATH} component={OidcCallback} />
      <PrivateRoute path={`/${localeParam}`} component={LocaleRoutes} />
      <Route render={() => <Redirect to={`/${currentLocale}`} />} />
    </Switch>
  );
};

export default AppRoutes;
