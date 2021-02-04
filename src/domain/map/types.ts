import Feature from 'ol/Feature';
import { DATALAYERS, MAPTILES } from './constants';
import { CommonGeoJSON, HankeGeoJSON } from '../../common/types/hanke';

export type ReducerState = {
  projects: CommonGeoJSON;
  status: string;
  error: string;
  visibleLayers: string[];
  selectedProject: null | string;
  drawGeometry: null | HankeGeoJSON;
  dataLayers: {
    [DATALAYERS.RESTAURANTS]: MapDatalayerState;
    [DATALAYERS.ROADS]: MapDatalayerState;
    [DATALAYERS.CYCLING_ROADS]: MapDatalayerState;
    [DATALAYERS.GREENERY]: MapDatalayerState;
  };
  mapTileLayers: {
    [MAPTILES.KANTAKARTTA]: MapTilelayerState;
    [MAPTILES.ORTOKARTTA]: MapTilelayerState;
  };
  hankeFilterStartDate: string;
  hankeFilterEndDate: string;
};

export type GeometryData = Feature[];

export interface HankeGeometryApiResponseData {
  hankeId: string;
  version: string;
  createdOn: string;
  updatedOn: string;
  featureCollection: HankeGeoJSON;
}

export interface HankeGeometryApiRequestData {
  hankeId?: string;
  version?: string;
  createdOn?: string;
  updatedOn?: string;
  featureCollection: HankeGeoJSON;
}

export type HankeGeometry = {
  data: CommonGeoJSON;
};

export type MapDataLayerKey = keyof typeof DATALAYERS;

export type MapTileLayerId = MAPTILES.ORTOKARTTA | MAPTILES.KANTAKARTTA;

export type MapDatalayerState = {
  key: MapDataLayerKey;
  data: CommonGeoJSON;
  visible: boolean;
};

export type MapTilelayerState = {
  id: MapTileLayerId;
  visible: boolean;
};

export type RouteMap = Record<MapDataLayerKey, MapDatalayerState>;
