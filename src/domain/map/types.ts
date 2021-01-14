import Feature from 'ol/Feature';
import { DATALAYERS } from './constants';
import { CommonGeoJSON, HankeGeoJSON } from '../../common/types/hanke';

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

export type HankeResponseWithGeometry = {
  id: number;
  hankeTunnus: string;
  onYKTHanke: boolean;
  nimi: string;
  kuvaus: string;
  alkuPvm: Date;
  loppuPvm: Date;
  version: number;
  createdBy: string;
  createdAt: Date;
  modifiedBy: string;
  modifiedAt: Date;
  saveType: string;
  omistajat: string[];
  arvioijat: string[];
  toteuttajat: string[];
  tyomaaKatuosoite: string;
  tyomaaTyyppi: string[];
  tyomaaKoko: string;

  haittaAlkuPvm: Date;
  haittaLoppuPvm: Date;
  kaistaHaitta: string;
  kaistaPituusHaitta: string;
  meluHaitta: string;
  polyHaitta: string;
  tarinaHaitta: string;
  geometriat: HankeResponseGeometry;
};

export type HankeResponseGeometry = {
  createdAt: Date;
  createdByUserId: string;
  featureCollection: HankeGeoJSON;
  hankeId: number;
  id: number;
  modifiedAt: Date;
  modifiedByUserId: string;
};

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
