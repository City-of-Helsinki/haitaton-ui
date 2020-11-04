import { DATALAYERS } from './constants';
import { AnyPropertyGeoJSON } from '../hanke/common/types/Hanke';

export type MapDatalayer = keyof typeof DATALAYERS;

export type MapDatalayerState = {
  data: AnyPropertyGeoJSON;
  visible: boolean;
};

export type RouteMap = Record<MapDatalayer, MapDatalayerState>;
