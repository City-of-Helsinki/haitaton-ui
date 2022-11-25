import GeoJSON from 'ol/format/GeoJSON';
import axios from 'axios';
import Geometry from 'ol/geom/Geometry';
import { getArea } from 'ol/sphere';
import { HankeGeoJSON } from '../../common/types/hanke';
import { GeometryData, HankeFilters } from './types';
import { HankeData, HankeDataDraft } from '../types/hanke';

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

export const formatFeaturesToAlluGeoJSON = (features: GeometryData): unknown => {
  const geoJson = new GeoJSON().writeFeaturesObject(features, {
    decimals: 2, // Not sure if this is correct
  });

  return {
    type: 'GeometryCollection',
    crs: {
      type: 'name',
      properties: {
        name: 'EPSG:3879',
      },
    },
    geometries: geoJson.features.map((feature) => feature.geometry),
  };
};

export const hankeHasGeometry = (hanke: HankeData | HankeDataDraft) =>
  hanke.alueet?.some((alue) => Boolean(alue.geometriat));

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

function getStreetName(input: string) {
  const matches = input.match(/^\D+/);
  if (matches) {
    return matches[0].trimEnd();
  }
  return '';
}

function getStreetNumber(input: string) {
  const matches = input.match(/[0-9]{1,5}$/);
  if (matches) {
    return matches[0];
  }
  return '';
}

// Search address geographic data based on search string:
// https://www.hel.fi/helsinki/fi/kartat-ja-liikenne/kartat-ja-paikkatieto/paikkatiedot+ja+-aineistot/avoimet+paikkatiedot
// https://kartta.hel.fi/avoindata/dokumentit/Prosessi_Työohje_kyselypalveluiden_kaytto_ulkoverkko.pdf
export function doAddressSearch(searchValue: string, abortController?: AbortController) {
  const streetName = getStreetName(searchValue);
  const streetNumber = getStreetNumber(searchValue);

  let url =
    'https://kartta.hel.fi/ws/geoserver/avoindata/wfs?SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature&TYPENAME=avoindata:Helsinki_osoiteluettelo&OUTPUTFORMAT=json&SORTBY=katunimi,osoitenumero&COUNT=300';

  if (!streetNumber) {
    url += `&CQL_FILTER=(katunimi%20ILIKE%20%27${streetName}%25%27%20OR%20gatan%20ILIKE%20%27${streetName}%25%27)`;
  } else {
    url += `&CQL_FILTER=((katunimi%20ILIKE%20%27${streetName}%25%27%20OR%20gatan%20ILIKE%20%27${streetName}%25%27)AND(osoitenumero=%27${streetNumber}%27))`;
  }

  return axios.get(url, { signal: abortController?.signal });
}

/**
 * Calculate and format a surface area (pinta-ala) for a given geometry
 * @param geometry Openlayers Geometry object
 * @returns surface area in square metres rounded to the nearest integer as string (e.g. 200 m²)
 */
export function formatSurfaceArea(geometry: Geometry) {
  const area = getArea(geometry);
  return `${Math.round(area)} m²`;
}
