import Feature from 'ol/Feature';
import { DATALAYERS } from './constants';
import { CommonGeoJSON, HankeGeoJSON } from '../../common/types/hanke';

export type GeometryData = Feature[];

export interface HankeGeometryApiResponseData extends HankeGeoJSON {
  hankeId: string;
  version: string;
  createdOn: string;
  updatedOn: string;
}

export interface HankeGeometryApiRequestData extends HankeGeoJSON {
  hankeId?: string;
  version?: string;
  createdOn?: string;
  updatedOn?: string;
}

export type HankeGeometry = {
  data: CommonGeoJSON;
};

export type MapDataLayerKey = keyof typeof DATALAYERS;

export type MapDatalayerState = {
  key: MapDataLayerKey;
  data: CommonGeoJSON;
  visible: boolean;
};

export type RouteMap = Record<MapDataLayerKey, MapDatalayerState>;
