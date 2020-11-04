export interface IHanke {
  name: string;
}

export type HankeGeoJSONProperties = {
  id: string | null;
  name: string;
  haittaindex: number | null;
  description: string;
  startdate: string;
  enddate: string;
  geomewkt: string;
};

export type LocationGeoJSONProperties = {
  id?: string;
  name: string;
  distance: string;
  geomewkt: string;
};

export type HankeGeoJSON = GeoJSON.FeatureCollection<GeoJSON.Geometry, HankeGeoJSONProperties>;

// eslint-disable-next-line
export type AnyPropertyGeoJSON = GeoJSON.FeatureCollection<GeoJSON.Geometry, any>;
