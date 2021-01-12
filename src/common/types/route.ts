export enum ROUTES {
  PROJECTS = 'PROJECTS',
  HOME = 'HOME',
  MAP = 'MAP',
  FORM = 'FORM',
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
