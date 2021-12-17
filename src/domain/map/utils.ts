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
  const filterStartDate = startDate ? new Date(startDate) : 0;
  const filterEndDate = endDate ? new Date(endDate) : 0;
  // both dates are unset in UI, return all
  if (filterStartDate === 0 && filterEndDate === 0) return true;

  const hankeEndDate = comparedEndDate ? new Date(comparedEndDate) : 0;

  // end date is not set in UI
  const hankeStartDate = comparedStartDate ? new Date(comparedStartDate) : 0;
  if (filterEndDate === 0) {
    if (
      filterStartDate <= hankeStartDate ||
      (filterStartDate >= hankeStartDate && filterStartDate <= hankeEndDate)
    )
      return true;
  }

  // both dates are set in the UI
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
