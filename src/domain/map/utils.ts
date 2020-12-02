import GeoJSON from 'ol/format/GeoJSON';
import { HankeGeoJSON } from '../../common/types/hanke';
import { GeometryData } from './types';
import { DATAPROJECTION, FEATUREPROJECTION } from './constants';

export const formatFeaturesToHankeGeoJSON = (features: GeometryData): HankeGeoJSON => {
  const format = new GeoJSON();
  const json = format.writeFeatures(features, {
    dataProjection: DATAPROJECTION,
    featureProjection: FEATUREPROJECTION,
    decimals: 1,
  });
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
