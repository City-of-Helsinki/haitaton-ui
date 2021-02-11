export enum ROUTES {
  PROJECTS = 'PROJECTS',
  HOME = 'HOME',
  MAP = 'MAP',
  NEW_HANKE = 'NEW_HANKE',
  EDIT_HANKE = 'EDIT_HANKE',
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
