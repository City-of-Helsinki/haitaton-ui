import GeoJSON from 'ol/format/GeoJSON';
import { GeometryData } from './types';
import { HankeGeoJSON } from '../../common/types/hanke';

export const formatFeaturesToHankeGeoJSON = (features: GeometryData): HankeGeoJSON => {
  const format = new GeoJSON();
  const json = format.writeFeatures(features);
  const data = JSON.parse(json);

  // ADD CRS (WIP)
  return {
    ...data,
    crs: {
      type: 'name',
      properties: {
        name: 'urn:ogc:def:crs:EPSG::3879',
      },
    },
  };
};
