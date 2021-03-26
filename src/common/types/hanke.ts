import GeoJSON from 'geojson';

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
};

export type HankeGeoJSON = GeoJSON.FeatureCollection<HaitatonGeometry, HankeGeoJSONProperties> & {
  crs: CRS;
};
