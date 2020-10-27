import { ROUTES } from '../constants/routes';

export type RouteData = {
  label: string;
  path: string;
  meta: {
    title: string;
  };
};

export type RouteMap = Record<keyof typeof ROUTES, RouteData>;
