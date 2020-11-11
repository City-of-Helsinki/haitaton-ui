export interface IHanke {
  name: string;
}

export interface HankeDemoGeoJSONProperties {
  id: string | null;
  name: string;
  haittaindex: number | null;
  description: string;
  startdate: string;
  enddate: string;
  geomewkt: string;
}

export interface HankeGeoJSONProperties {
  geometryType?: string; // Haitaton 2.0
}

export interface CommonGeoJSONProperties {
  id?: string | number | undefined;
  type?: string;
  Name?: string;
  name?: string | null;
  distance?: string;
  geomewkt?: string;
}

export interface CRS {
  type: 'string';
  properties: {
    name: 'urn:ogc:def:crs:EPSG::3879';
  };
}

export type CommonGeoJSON = GeoJSON.FeatureCollection<GeoJSON.Geometry, CommonGeoJSONProperties>;

export type HankeDemoGeoJSON = GeoJSON.FeatureCollection<
  GeoJSON.Geometry,
  HankeDemoGeoJSONProperties
>;

// WIP
/* export interface HankeGeoJSON
  extends GeoJSON.FeatureCollection<GeoJSON.Geometry, HankeGeoJSONProperties> {
  crs: CRS;
} */

export type HankeGeoJSON = GeoJSON.FeatureCollection<GeoJSON.Geometry, HankeGeoJSONProperties>;
