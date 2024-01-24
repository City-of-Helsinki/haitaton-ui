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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type HankeGeoJSON = GeoJSON.FeatureCollection<any, HankeGeoJSONProperties> & {
  crs: CRS;
};
