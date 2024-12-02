import GeoJSON from 'ol/format/GeoJSON';
import axios from 'axios';
import Geometry from 'ol/geom/Geometry';
import { Feature } from 'ol';
import Polygon from 'ol/geom/Polygon';
import { Interval, isWithinInterval } from 'date-fns';
import { HankeGeoJSON } from '../../common/types/hanke';
import { DateInterval, GeometryData } from './types';
import { HankeData, HankeDataDraft, HankeGeometria } from '../types/hanke';
import { getSurfaceArea } from '../../common/components/map/utils';

export const formatFeaturesToHankeGeoJSON = (features: GeometryData): HankeGeoJSON => {
  const format = new GeoJSON();
  const json = format.writeFeatures(features);
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

export const hankeHasGeometry = (hanke: HankeData | HankeDataDraft) =>
  hanke.alueet?.some((alue) => Boolean(alue.geometriat));

/**
 * Check if date range is is within interval.
 * Interval to check against is given to the function as an object with start and end properties.
 * Returns a function that takes a date range an checks if that is within the interval.
 * Optional allowOverlapping option can be given, and if it's true the function
 * will return true also if the date ranges overlap.
 */
export const areDatesWithinInterval =
  (interval: DateInterval, options?: { allowOverlapping?: boolean }) =>
  (dateRange: DateInterval) => {
    if (!interval.start || !interval.end || !dateRange.start || !dateRange.end) {
      return true;
    }

    const dateRangeStartWithinInterval = isWithinInterval(dateRange.start, interval as Interval);
    const dateRangeEndWithinInterval = isWithinInterval(dateRange.end, interval as Interval);

    if (options?.allowOverlapping) {
      const intervalStartWithinDateRange = isWithinInterval(interval.start, dateRange as Interval);
      const intervalEndWithinDateRange = isWithinInterval(interval.end, dateRange as Interval);
      return (
        dateRangeStartWithinInterval ||
        dateRangeEndWithinInterval ||
        intervalStartWithinDateRange ||
        intervalEndWithinDateRange
      );
    }

    return dateRangeStartWithinInterval && dateRangeEndWithinInterval;
  };

export function getStreetName(input: string) {
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
 * @param geometry OpenLayers Geometry object
 * @returns surface area in square metres rounded to the nearest integer as string (e.g. 200 m²)
 */
export function formatSurfaceArea(geometry: Geometry | undefined) {
  if (!geometry) {
    return null;
  }

  const area = getSurfaceArea(geometry);
  return `${Math.round(area)} m²`;
}

/**
 * Calculate total surface area for array of geometries
 */
export function getTotalSurfaceArea(geometries: Geometry[]): number {
  try {
    const totalSurfaceArea = geometries.reduce((totalArea, geom) => {
      return totalArea + Math.round(getSurfaceArea(geom));
    }, 0);
    return totalSurfaceArea;
  } catch (error) {
    return 0;
  }
}

/**
 * Get OpenLayers Feature from Hanke geometry
 * @param geometry Hanke area geometry
 * @returns OpenLayers Feature
 */
export function getFeatureFromHankeGeometry(geometry: HankeGeometria) {
  const feature = new Feature(
    new Polygon(geometry.featureCollection.features[0]?.geometry.coordinates),
  );

  return feature;
}
