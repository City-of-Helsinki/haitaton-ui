import { ApplicationType } from '../../domain/application/types/application';

export enum ROUTES {
  HANKEPORTFOLIO = 'HANKEPORTFOLIO',
  HANKE = 'HANKE',
  HOME = 'HOME',
  PUBLIC_HANKKEET = 'PUBLIC_HANKKEET',
  PUBLIC_HANKKEET_MAP = 'PUBLIC_HANKKEET_MAP',
  PUBLIC_HANKKEET_LIST = 'PUBLIC_HANKKEET_LIST',
  EDIT_HANKE = 'EDIT_HANKE',
  ACCESS_RIGHTS = 'ACCESS_RIGHTS',
  EDIT_USER = 'EDIT_USER',
  FULL_PAGE_MAP = 'FULL_PAGE_MAP',
  HAKEMUS = 'HAKEMUS',
  JOHTOSELVITYSHAKEMUS = 'JOHTOSELVITYSHAKEMUS',
  EDIT_JOHTOSELVITYSHAKEMUS = 'EDIT_JOHTOSELVITYSHAKEMUS',
  EDIT_JOHTOSELVITYSTAYDENNYS = 'EDIT_JOHTOSELVITYSTAYDENNYS',
  KAIVUILMOITUSHAKEMUS = 'KAIVUILMOITUSHAKEMUS',
  EDIT_KAIVUILMOITUSHAKEMUS = 'EDIT_KAIVUILMOITUSHAKEMUS',
  EDIT_KAIVUILMOITUSTAYDENNYS = 'EDIT_KAIVUILMOITUSTAYDENNYS',
  EDIT_KAIVUILMOITUSMUUTOSILMOITUS = 'EDIT_KAIVUILMOITUSMUUTOSILMOITUS',
  HAITATON_INFO = 'HAITATON_INFO',
  ACCESSIBILITY = 'ACCESSIBILITY',
  PRIVACY_POLICY = 'PRIVACY_POLICY',
  REFERENCES = 'REFERENCES',
  MANUAL = 'MANUAL',
  WORKINSTRUCTIONS = 'WORKINSTRUCTIONS',
  CARDS_INDEX = 'CARDS_INDEX',
  CARD = 'CARD',
}

export type Route = keyof typeof ROUTES;

export type RouteData = {
  label: string;
  path: string;
  meta: {
    title: string;
  };
};

export type RouteMap = Record<keyof typeof ROUTES, RouteData>;

export const HAKEMUS_ROUTES: Record<ApplicationType, ROUTES> = {
  CABLE_REPORT: ROUTES.EDIT_JOHTOSELVITYSHAKEMUS,
  EXCAVATION_NOTIFICATION: ROUTES.EDIT_KAIVUILMOITUSHAKEMUS,
};

export const HAKEMUS_TAYDENNYS_ROUTES: Record<ApplicationType, ROUTES> = {
  CABLE_REPORT: ROUTES.EDIT_JOHTOSELVITYSTAYDENNYS,
  EXCAVATION_NOTIFICATION: ROUTES.EDIT_KAIVUILMOITUSTAYDENNYS,
};
