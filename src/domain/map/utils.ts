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

export const hankeHasGeometry = (hanke: HankeData) => hanke.geometriat;

export const hankeIsBetweenDates = ({ endDate, startDate }: HankeFilters) => (hanke: HankeData) => {
  const filterStartDate = new Date(startDate);
  const filterEndDate = new Date(endDate);
  const hankeStartDate = new Date(hanke.alkuPvm);
  const hankeEndDate = new Date(hanke.loppuPvm);
  if (
    hankeStartDate <= filterStartDate &&
    hankeStartDate <= filterEndDate &&
    hankeEndDate >= filterStartDate &&
    hankeEndDate <= filterEndDate
  )
    return true;
  if (
    hankeStartDate >= filterStartDate &&
    hankeStartDate <= filterEndDate &&
    hankeEndDate >= filterStartDate &&
    hankeEndDate <= filterEndDate
  )
    return true;
  if (
    hankeStartDate >= filterStartDate &&
    hankeStartDate <= filterEndDate &&
    hankeEndDate >= filterStartDate &&
    hankeEndDate >= filterEndDate
  )
    return true;
  if (
    hankeStartDate <= filterStartDate &&
    hankeStartDate <= filterEndDate &&
    hankeEndDate >= filterStartDate &&
    hankeEndDate <= filterEndDate
  )
    return true;
  if (
    // filters are between the hankeStart and End
    filterStartDate >= hankeStartDate &&
    filterStartDate <= hankeEndDate &&
    filterEndDate >= hankeStartDate &&
    filterEndDate <= hankeEndDate
  )
    return true;
  return false;
};

export const byAllHankeFilters = (hankeFilters: HankeFilters) => (hanke: HankeData) =>
  hankeHasGeometry(hanke) && hankeIsBetweenDates(hankeFilters)(hanke);
