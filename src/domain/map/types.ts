import { DATALAYERS } from './constants';
import { CommonGeoJSON } from '../../common/types/hanke';

export type MapDataLayerKey = keyof typeof DATALAYERS;

export type MapDatalayerState = {
  key: MapDataLayerKey;
  data: CommonGeoJSON;
  visible: boolean;
};

export type RouteMap = Record<MapDataLayerKey, MapDatalayerState>;
