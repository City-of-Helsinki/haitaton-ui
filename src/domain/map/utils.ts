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
      type: 'EPSG:3879',
      properties: {
        name: 'urn:ogc:def:crs:EPSG::3879',
      },
    },
  };
};
