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

export type CommonGeoJSONProperties = {
  id?: string | number | undefined;
  type?: string;
  Name?: string;
  name?: string | null;
  distance?: string;
  geomewkt?: string;
};

export type HankeGeoJSON = GeoJSON.FeatureCollection<GeoJSON.Geometry, HankeGeoJSONProperties>;

export type CommonGeoJSON = GeoJSON.FeatureCollection<GeoJSON.Geometry, CommonGeoJSONProperties>;
