import { i18n as i18nInstance } from 'i18next';
import { useTranslation, UseTranslationResponse } from 'react-i18next';
import { $enum } from 'ts-enum-util';
import { ROUTES, RouteMap } from '../types/route';
import { Language } from '../types/language';

export const APPLICATION_ID_REGEXP = /(?<=\/)(\d+)/;
export const HANKETUNNUS_REGEXP = /HAI\d{2}-(\d+)/;
export const USER_ID_REGEXP = /(?<=\/)(.{8}-.{4}-.{4}-.{4}-.{12})/;

type GetLocalizationParams = {
  useTranslationResponse: UseTranslationResponse<''>;
  route: string;
  name: 'path' | 'headerLabel' | 'meta.title';
};

export const getRouteLocalization = ({
  useTranslationResponse,
  route,
  name,
}: GetLocalizationParams): string => {
  const { t, i18n } = useTranslationResponse;
  const { language } = i18n;
  const translationPath = `routes:${route}.${name}`;
  if (!i18n.exists(translationPath)) {
    throw new Error(`Translation doesnt exists: ${translationPath}`);
  }
  return name === 'path' ? `/${language}${t(translationPath)}` : t(translationPath);
};

// Resolves and return ROUTE enum by path
export const getMatchingRouteKey = (i18n: i18nInstance, language: Language, path: string) => {
  // eslint-disable-next-line
  const res: any = i18n.getDataByLanguage(language);
  let pathWithoutLocale = path.length > 3 ? path.substring(3) : path;
  pathWithoutLocale = pathWithoutLocale
    .replace(USER_ID_REGEXP, ':id')
    .replace(APPLICATION_ID_REGEXP, ':id')
    .replace(HANKETUNNUS_REGEXP, ':hankeTunnus');

  // Find first matching routekey
  const routeKey = Object.keys(res.routes).find((key) =>
    res.routes[key].path.includes(pathWithoutLocale),
  );

  return routeKey || ROUTES.HOME;
};

export const useLocalizedRoutes = (): RouteMap => {
  const useTranslationResponse = useTranslation();

  return $enum(ROUTES)
    .getKeys()
    .reduce(
      (routes, route) => ({
        ...routes,
        [route]: {
          path: getRouteLocalization({
            useTranslationResponse,
            route,
            name: 'path',
          }),
          label: getRouteLocalization({ useTranslationResponse, route, name: 'headerLabel' }),
          meta: {
            title: getRouteLocalization({ useTranslationResponse, route, name: 'meta.title' }),
          },
        },
      }),
      {} as RouteMap,
    );
};
