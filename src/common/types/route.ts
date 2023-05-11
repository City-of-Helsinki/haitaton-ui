export enum ROUTES {
  HANKEPORTFOLIO = 'HANKEPORTFOLIO',
  HANKE = 'HANKE',
  HOME = 'HOME',
  PUBLIC_HANKKEET = 'PUBLIC_HANKKEET',
  PUBLIC_HANKKEET_MAP = 'PUBLIC_HANKKEET_MAP',
  PUBLIC_HANKKEET_LIST = 'PUBLIC_HANKKEET_LIST',
  NEW_HANKE = 'NEW_HANKE',
  EDIT_HANKE = 'EDIT_HANKE',
  FULL_PAGE_MAP = 'FULL_PAGE_MAP',
  HAKEMUS = 'HAKEMUS',
  JOHTOSELVITYSHAKEMUS = 'JOHTOSELVITYSHAKEMUS',
  EDIT_JOHTOSELVITYSHAKEMUS = 'EDIT_JOHTOSELVITYSHAKEMUS',
  HAITATON_INFO = 'HAITATON_INFO',
  ACCESSIBILITY = 'ACCESSIBILITY',
  PRIVACY_POLICY = 'PRIVACY_POLICY',
  REFERENCES = 'REFERENCES',
  MANUAL = 'MANUAL',
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
