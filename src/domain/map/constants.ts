import { projection } from '../../common/components/map/utils';

export enum DATALAYERS {
  RESTAURANTS = 'RESTAURANTS',
  ROADS = 'ROADS',
  CYCLING_ROADS = 'CYCLING_ROADS',
  GREENERY = 'GREENERY',
}

export const DATAPROJECTION = 'EPSG:3857';
export const FEATUREPROJECTION = projection;
