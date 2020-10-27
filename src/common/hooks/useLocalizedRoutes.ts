import { TFunction, i18n as i18nInstance } from 'i18next';
import { useTranslation } from 'react-i18next';
import { $enum } from 'ts-enum-util';
import { ROUTES } from '../constants/routes';
import { RouteMap } from '../types/route';

type GetLocalizationParams = {
  t: TFunction;
  i18n: i18nInstance;
  language: string | null;
  route: string;
  name: string;
};

export const getLocalization = ({
  t,
  i18n,
  language,
  route,
  name,
}: GetLocalizationParams): string | Error => {
  const translationPath = `routes:${route}.${name}`;
  if (!i18n.exists(translationPath)) {
    throw new Error(`Translation doesnt exists: ${translationPath}`);
  }

  return language ? `/${language}${t(translationPath)}` : t(translationPath);
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
          path: getLocalization({ t, i18n, language, route, name: 'path' }),
          label: getLocalization({ t, i18n, language: null, route, name: 'headerLabel' }),
          meta: {
            title: getLocalization({ t, i18n, language: null, route, name: 'meta.title' }),
          },
        },
      }),
      {} as RouteMap
    );
};
