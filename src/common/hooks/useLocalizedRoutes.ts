import { TFunction, i18n as i18nInstance } from 'i18next';
import { useTranslation } from 'react-i18next';
import { $enum } from 'ts-enum-util';
import { ROUTES, RouteMap } from '../types/route';
import { Language } from '../types/language';

type GetLocalizationParams = {
  t: TFunction;
  i18n: i18nInstance;
  language: Language | null;
  route: string;
  name: 'path' | 'headerLabel' | 'meta.title';
};

export const getRouteLocalization = ({
  t,
  i18n,
  language,
  route,
  name,
}: GetLocalizationParams): string => {
  const translationPath = `routes:${route}.${name}`;
  if (!i18n.exists(translationPath)) {
    throw new Error(`Translation doesnt exists: ${translationPath}`);
  }
  return language ? `/${language}${t(translationPath)}` : t(translationPath);
};

// Resolves and return ROUTE enum by path
export const getMatchingRouteKey = (i18n: i18nInstance, language: Language, path: string) => {
  // eslint-disable-next-line
  const res: any = i18n.getDataByLanguage(language);
  const strippedPath = path.length > 3 ? path.substring(3) : path;

  // Find first matching routekey
  const routeKey = Object.keys(res.routes).find((key) =>
    res.routes[key].path.includes(strippedPath)
  );

  return routeKey || ROUTES.HOME;
};

export const useLocalizedRoutes = (): RouteMap => {
  const { i18n, t } = useTranslation();
  const { language } = i18n;

  return $enum(ROUTES)
    .getKeys()
    .reduce(
      (routes, route) => ({
        ...routes,
        [route]: {
          path: getRouteLocalization({
            t,
            i18n,
            language: language as Language,
            route,
            name: 'path',
          }),
          label: getRouteLocalization({ t, i18n, language: null, route, name: 'headerLabel' }),
          meta: {
            title: getRouteLocalization({ t, i18n, language: null, route, name: 'meta.title' }),
          },
        },
      }),
      {} as RouteMap
    );
};
