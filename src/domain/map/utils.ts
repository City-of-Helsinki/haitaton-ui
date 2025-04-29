import GeoJSON from 'ol/format/GeoJSON';
import axios from 'axios';
import Geometry from 'ol/geom/Geometry';
import { Feature } from 'ol';
import Polygon from 'ol/geom/Polygon';
import { Interval, isWithinInterval } from 'date-fns';
import { HankeGeoJSON } from '../../common/types/hanke';
import { DateInterval, GeometryData } from './types';
import { HankeGeometria } from '../types/hanke';
import { getSurfaceArea } from '../../common/components/map/utils';
import {
  Feature as GeoJSONFeature,
  FeatureCollection,
  Polygon as GeoJSONPolygon,
  Position,
} from 'geojson';
import {
  feature as turfFeature,
  featureCollection as turfFeatureCollection,
  multiPolygon as turfMultiPolygon,
} from '@turf/helpers';
import booleanIntersects from '@turf/boolean-intersects';
import union from '@turf/union';
import booleanEqual from '@turf/boolean-equal';
import intersect from '@turf/intersect';
import { ApplicationArea, ApplicationGeometry } from '../application/types/application';

const format = new GeoJSON();

export const formatFeaturesToHankeGeoJSON = (features: GeometryData): HankeGeoJSON => {
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

/**
 * Check if date range is within interval.
 * Interval to check against is given to the function as an object with start and end properties.
 * Returns a function that takes a date range and checks if that is within the interval.
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
    return geometries.reduce((totalArea, geom) => {
      return totalArea + Math.round(getSurfaceArea(geom));
    }, 0);
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
  return new Feature(new Polygon(geometry.featureCollection.features[0]?.geometry.coordinates));
}

/**
 * Returns true if feature1 contains feature2.
 *
 * Due to a bug in Turf.js's `booleanContains` function (https://github.com/Turfjs/turf/issues/2588),
 * this function checks that the intersection of feature1 and feature2 is equal to feature2.
 * Equality is checked without properties.
 */
export function featureContains(
  outer: GeoJSONFeature<GeoJSONPolygon>,
  inner: GeoJSONFeature<GeoJSONPolygon>,
): boolean {
  const features: FeatureCollection<GeoJSONPolygon> = turfFeatureCollection([outer, inner]);
  const intersected = intersect(features);
  const innerWithoutProperties: GeoJSONFeature<GeoJSONPolygon> = { ...inner, properties: {} };
  return (intersected && booleanEqual(intersected, innerWithoutProperties)) || false;
}

export function applicationGeometryContains(
  puter: ApplicationGeometry,
  inner: ApplicationGeometry,
): boolean {
  const outerFeature = turfFeature(puter);
  const innerFeature = turfFeature(inner);
  return featureContains(outerFeature, innerFeature);
}

export function featureContainsApplicationGeometry(
  feature: GeoJSONFeature<GeoJSONPolygon>,
  geometry: ApplicationGeometry,
): boolean {
  const inner = turfFeature(geometry);
  return featureContains(feature, inner);
}

export function olFeatureToGeoJSON(
  feature?: Feature<Polygon>,
): GeoJSONFeature<GeoJSONPolygon> | undefined {
  return (
    feature &&
    (format.writeFeatureObject(feature, {
      featureProjection: 'EPSG:3879',
      dataProjection: 'EPSG:3879',
    }) as GeoJSONFeature<GeoJSONPolygon>)
  );
}

/**
 * Combines multiple application areas into a single unified area by performing a union operation
 * on their geometries. The function iterates through the provided application areas and checks
 * if their geometries intersect with the current combined area. If they do, it merges them into
 * a single geometry.
 */
export function createUnionFromAreas(areas: ApplicationArea[], initialValue: ApplicationArea) {
  return areas.reduce((combinedArea, currentArea) => {
    if (booleanIntersects(combinedArea.geometry, currentArea.geometry)) {
      const features = turfFeatureCollection([
        turfFeature(combinedArea.geometry),
        turfFeature(currentArea.geometry),
      ]);
      const unionFeature = union(features);
      if (unionFeature?.geometry) {
        return {
          ...combinedArea,
          geometry: new ApplicationGeometry(unionFeature.geometry.coordinates as Position[][]),
        };
      }
    }
    return combinedArea;
  }, initialValue);
}

/**
 * Creates a MultiPolygon geometry by combining the geometries of the given areas.
 * If the geometry of the current area intersects with the combined geometry,
 * it merges the coordinates into a single MultiPolygon. Otherwise, it skips the current area.
 */
export function createMultiPolygonFromAreas(
  areas: ApplicationArea[],
  initialValue: ApplicationArea,
) {
  return areas.reduce(
    (combinedArea, currentArea) => {
      if (booleanIntersects(combinedArea.geometry, currentArea.geometry)) {
        return turfMultiPolygon([
          ...combinedArea.geometry.coordinates,
          currentArea.geometry.coordinates,
        ]);
      }
      return combinedArea;
    },
    turfMultiPolygon([initialValue.geometry.coordinates]),
  );
}
