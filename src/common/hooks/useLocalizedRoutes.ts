import { TFunction, i18n as Ii18n } from 'i18next';
import { useTranslation } from 'react-i18next';
import { $enum } from 'ts-enum-util';
import { ROUTES } from '../constants/routes';

export type RouteData = {
  label: string;
  path: string;
  meta: {
    title: string;
  };
};

type RouteMap = Record<keyof typeof ROUTES, RouteData>;

type GetLocaleParams = {
  t: TFunction;
  i18n: Ii18n;
  language: string | null;
  route: string;
  name: string;
};

export const getLocale = ({ t, i18n, language, route, name }: GetLocaleParams): string | Error => {
  const translationPath = `routes:${route}.${name}`;
  if (!i18n.exists(translationPath)) {
    throw new Error(`Translation doesnt exists. Path: ${translationPath}`);
  }

  return language ? `/${language}${t(translationPath)}` : t(translationPath);
};

export const useLocalizedRoutes = (): RouteMap => {
  const { i18n, t } = useTranslation();
  const { language } = i18n;

  return $enum(ROUTES)
    .getKeys()
    .reduce(
      (routes: RouteMap, route) => ({
        ...routes,
        [route]: {
          path: getLocale({ t, i18n, language, route, name: 'path' }),
          label: getLocale({ t, i18n, language: null, route, name: 'headerLabel' }),
          meta: {
            title: getLocale({ t, i18n, language: null, route, name: 'meta.title' }),
          },
        },
      }),
      {} as RouteMap
    );
};
