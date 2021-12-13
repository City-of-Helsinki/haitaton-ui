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

export const hankeIsBetweenDates = ({ endDate, startDate }: HankeFilters) => ({
  startDate: comparedStartDate,
  endDate: comparedEndDate,
}: HankeFilters) => {
  const filterStartDate = new Date(startDate);
  const filterEndDate = new Date(endDate);
  const hankeStartDate = new Date(comparedStartDate);
  const hankeEndDate = new Date(comparedEndDate);

  if (
    hankeStartDate <= filterStartDate &&
    hankeStartDate <= filterEndDate &&
    hankeEndDate >= filterStartDate &&
    hankeEndDate <= filterEndDate
  )
    return true;
  if (
    hankeStartDate <= filterStartDate &&
    hankeStartDate <= filterEndDate &&
    hankeEndDate >= filterStartDate &&
    hankeEndDate >= filterEndDate
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

  return false;
};

export const byAllHankeFilters = (hankeFilters: HankeFilters) => (hanke: HankeData) =>
  hankeHasGeometry(hanke) &&
  hankeIsBetweenDates(hankeFilters)({ startDate: hanke.alkuPvm, endDate: hanke.loppuPvm });
