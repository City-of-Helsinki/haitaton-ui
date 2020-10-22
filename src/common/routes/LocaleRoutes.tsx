import React from 'react';
import { useTranslation } from 'react-i18next';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { Language } from '../types/language';
import ProjectsPage from '../../pages/ProjectsPage';
import MapPage from '../../pages/MapPage';
import ProjectPage from '../../pages/ProjectPage';
import HomePage from '../../pages/HomePage';

interface Params {
  locale: Language;
}

type Props = RouteComponentProps<Params>;

const LocaleRoutes: React.FC<Props> = ({
  match: {
    params: { locale },
  },
}) => {
  const { i18n } = useTranslation();

  const getLocelePath = (path: string) => `/${locale}${path}`;

  React.useEffect(() => {
    i18n.changeLanguage(locale);
  }, [i18n, locale]);

  return (
    <Switch>
      <Route exact path={getLocelePath(ROUTES.HOME)} component={HomePage} />
      <Route exact path={getLocelePath(ROUTES.FORM)} component={ProjectPage} />
      <Route exact path={getLocelePath(ROUTES.PROJECTS)} component={ProjectsPage} />
      <Route exact path={getLocelePath(ROUTES.MAP)} component={MapPage} />
    </Switch>
  );
};

export default LocaleRoutes;
