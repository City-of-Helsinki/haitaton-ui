import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, Route, RouteComponentProps, Switch } from 'react-router-dom';
import { Language } from '../types/language';
import ProjectsPage from '../../pages/ProjectsPage';
import MapPage from '../../pages/MapPage';
import ProjectPage from '../../pages/ProjectPage';
import HomePage from '../../pages/HomePage';
import {
  useLocalizedRoutes,
  getRouteLocalization,
  getMatchingRouteKey,
} from '../hooks/useLocalizedRoutes';

interface Params {
  locale: Language;
}

type Props = RouteComponentProps<Params>;

const LocaleRoutes: React.FC<Props> = ({
  location,
  match: {
    params: { locale: localeParam },
  },
}) => {
  const history = useHistory();
  const { i18n, t } = useTranslation();
  const { HOME, FORM, PROJECTS, MAP } = useLocalizedRoutes();
  const { language: currentLocale } = i18n;

  // Update language when route param changes
  React.useEffect(() => {
    i18n.changeLanguage(localeParam);
  }, [i18n, localeParam]);

  // Redirect when user changes langauge
  React.useEffect(() => {
    i18n.changeLanguage(currentLocale);
    const redirectPath = getRouteLocalization({
      t,
      i18n,
      route: getMatchingRouteKey(i18n, localeParam, location.pathname),
      language: currentLocale as Language,
      name: 'path',
    });

    history.push(redirectPath);
  }, [currentLocale]);

  return (
    <Switch>
      <Route exact path={HOME.path} component={HomePage} />
      <Route exact path={FORM.path} component={ProjectPage} />
      <Route exact path={PROJECTS.path} component={ProjectsPage} />
      <Route exact path={MAP.path} component={MapPage} />
    </Switch>
  );
};

export default LocaleRoutes;
