import GeoJSON from 'ol/format/GeoJSON';
import { HankeGeoJSON } from '../../common/types/hanke';
import { GeometryData, HankeFilters } from './types';
import { HankeData } from '../types/hanke';

export const formatFeaturesToHankeGeoJSON = (features: GeometryData): HankeGeoJSON => {
  const format = new GeoJSON();
  const json = format.writeFeatures(features, {
    decimals: 2, // Not sure if this is correct
  });
  const data = JSON.parse(json);

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

export const hankeWithGeometryIsBetweenDates = (
  hanke: HankeData,
  hankeFilterStartDate: HankeFilters['startDate'],
  hankeFilterEndDate: HankeFilters['endDate']
) => {
  if (!hanke.geometriat) {
    return false;
  }
  if (hanke.geometriat) {
    const startDate = new Date(hankeFilterStartDate);
    const endDate = new Date(hankeFilterEndDate);
    const hankeStartDate = new Date(hanke.alkuPvm); // TODO: validoi: haittaAlkuPvm vai alkuPvm?
    const hankeEndDate = new Date(hanke.loppuPvm); // TODO: validoi: haittaLoppuPvm vai loppuPvm?
    if (hankeEndDate > startDate && hankeEndDate < endDate) return true;
    if (hankeStartDate > startDate && hankeEndDate < endDate) return true;
    if (hankeStartDate > startDate && hankeEndDate > endDate) return true;
  }
  return false;
};
