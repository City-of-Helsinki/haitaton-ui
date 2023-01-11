import GeoJSON, { Polygon } from 'geojson';

export interface HankeGeoJSONProperties {
  hankeTunnus: string;
}
export interface CRS {
  type: string;
  properties: {
    name: string;
  };
}

export type HaitatonGeometry = GeoJSON.Geometry & {
  crs: CRS;
  geometries: Polygon[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type HankeGeoJSON = GeoJSON.FeatureCollection<any, HankeGeoJSONProperties> & {
  crs: CRS;
};
