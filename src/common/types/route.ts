export enum ROUTES {
  PROJECTS = 'PROJECTS',
  HANKEPORTFOLIO = 'HANKEPORTFOLIO',
  HOME = 'HOME',
  MAP = 'MAP',
  NEW_HANKE = 'NEW_HANKE',
  EDIT_HANKE = 'EDIT_HANKE',
  HAKEMUS = 'HAKEMUS',
  JOHTOSELVITYSHAKEMUS = 'JOHTOSELVITYSHAKEMUS',
  HAITATON_INFO = 'HAITATON_INFO',
  ACCESSIBILITY = 'ACCESSIBILITY',
  PRIVACY_POLICY = 'PRIVACY_POLICY',
  REFERENCES = 'REFERENCES',
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
