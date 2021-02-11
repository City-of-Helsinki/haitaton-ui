import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, Route, RouteComponentProps, Switch } from 'react-router-dom';
import { Language } from '../types/language';
import HankeListPage from '../../pages/HankeListPage';
import MapPage from '../../pages/MapPage';
import NewHankePage from '../../pages/NewHankePage';
import EditHankePage from '../../pages/EditHankePage';
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
  const useTranslationResponse = useTranslation();
  const { HOME, NEW_HANKE, EDIT_HANKE, PROJECTS, MAP } = useLocalizedRoutes();

  const { i18n } = useTranslationResponse;
  const { language: currentLocale } = i18n;

  // Update language when route param changes
  React.useEffect(() => {
    i18n.changeLanguage(localeParam);
  }, [i18n, localeParam]);

  // Redirect when user changes langauge
  React.useEffect(() => {
    // return if nothing changed
    if (currentLocale === localeParam) return;
    i18n.changeLanguage(currentLocale);
    const redirectPath = getRouteLocalization({
      useTranslationResponse,
      route: getMatchingRouteKey(i18n, localeParam, location.pathname),
      name: 'path',
    });

    history.push(redirectPath);
  }, [currentLocale, localeParam]);

  return (
    <Switch>
      <Route exact path={HOME.path} component={HomePage} />
      <Route exact path={NEW_HANKE.path} component={NewHankePage} />
      <Route exact path={EDIT_HANKE.path} component={EditHankePage} />
      <Route exact path={PROJECTS.path} component={HankeListPage} />
      <Route exact path={MAP.path} component={MapPage} />
    </Switch>
  );
};

export default LocaleRoutes;
