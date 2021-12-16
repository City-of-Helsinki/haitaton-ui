import Feature from 'ol/Feature';
import { MAPTILES } from './constants';
import { HankeGeoJSON } from '../../common/types/hanke';

export type ReducerState = {
  status: string;
  error: string;
  visibleLayers: string[];
  selectedProject: null | string;
  drawGeometry: null | HankeGeoJSON;
  mapTileLayers: {
    [MAPTILES.KANTAKARTTA]: MapTilelayerState;
    [MAPTILES.ORTOKARTTA]: MapTilelayerState;
  };
  hankeFilters: HankeFilters;
};

export type GeometryData = Feature[];

export type HankeFilters = {
  startDate: string | null;
  endDate: string | null;
};

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

export type MapTileLayerId = MAPTILES.ORTOKARTTA | MAPTILES.KANTAKARTTA;

export type MapTilelayerState = {
  id: MapTileLayerId;
  visible: boolean;
};
