import React from 'react';
import { useTranslation } from 'react-i18next';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import { Language } from '../types/language';
import ProjectsPage from '../../pages/ProjectsPage';
import MapPage from '../../pages/MapPage';
import ProjectPage from '../../pages/ProjectPage';
import HomePage from '../../pages/HomePage';
import { useLocalizedRoutes } from '../hooks/useLocalizedRoutes';

interface Params {
  locale: Language;
}

type Props = RouteComponentProps<Params>;

const LocaleRoutes: React.FC<Props> = ({
  match: {
    params: { locale },
  },
}) => {
  const { HOME, FORM, PROJECTS, MAP } = useLocalizedRoutes();

  const { i18n } = useTranslation();

  React.useEffect(() => {
    i18n.changeLanguage(locale);
  }, [i18n, locale]);

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
