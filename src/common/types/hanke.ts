import GeoJSON from 'geojson';

export interface HankeGeoJSONProperties {
  hankeTunnus: string;
}
export interface CRS {
  type: string;
  properties: {
    name?: string;
  };
}

export type HankeGeoJSON = GeoJSON.FeatureCollection<GeoJSON.Geometry, HankeGeoJSONProperties> & {
  crs: CRS;
};
