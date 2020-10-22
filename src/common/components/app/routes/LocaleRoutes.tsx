import React from 'react';
import { useTranslation } from 'react-i18next';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import { ROUTES } from '../../../constants';
import { Language } from '../../../types/locales';
import HankeList from '../../../../pages/projects/ProjectsPage';
import HankeMap from '../../../../domain/hanke/map/HankeMap';
import HankeForm from '../../../../domain/hanke/edit/Form';
import Main from '../Main';

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
      <Route exact path={getLocelePath(ROUTES.HOME)} component={Main} />
      <Route exact path={getLocelePath(ROUTES.FORM)} component={HankeForm} />
      <Route exact path={getLocelePath(ROUTES.PROJECTS)} component={HankeList} />
      <Route exact path={getLocelePath(ROUTES.MAP)} component={HankeMap} />
    </Switch>
  );
};

export default LocaleRoutes;
