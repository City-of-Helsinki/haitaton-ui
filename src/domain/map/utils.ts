import GeoJSON from 'ol/format/GeoJSON';
import axios from 'axios';
import Geometry from 'ol/geom/Geometry';
import { Feature } from 'ol';
import Polygon from 'ol/geom/Polygon';
import { HankeGeoJSON } from '../../common/types/hanke';
import { GeometryData, HankeFilters } from './types';
import { HankeData, HankeDataDraft, HankeGeometria } from '../types/hanke';
import { getSurfaceArea } from '../../common/components/map/utils';
import { HAITTA_INDEX_TYPE, HaittaIndexData } from '../common/haittaIndexes/types';

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

export const hankeIsBetweenDates =
  ({ endDate, startDate }: HankeFilters) =>
  ({ startDate: comparedStartDate, endDate: comparedEndDate }: HankeFilters) => {
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

export function calculateLiikennehaittaindeksienYhteenveto(
  haittaindeksit: HaittaIndexData[],
): HaittaIndexData {
  return haittaindeksit.reduce(
    (acc, haittaindeksi) => {
      return {
        liikennehaittaindeksi: {
          indeksi: Math.max(
            acc.liikennehaittaindeksi.indeksi,
            haittaindeksi.liikennehaittaindeksi.indeksi,
          ),
          tyyppi: HAITTA_INDEX_TYPE.PYORALIIKENNEINDEKSI,
        },
        pyoraliikenneindeksi: Math.max(
          acc.pyoraliikenneindeksi,
          haittaindeksi.pyoraliikenneindeksi,
        ),
        autoliikenne: {
          indeksi: Math.max(acc.autoliikenne.indeksi, haittaindeksi.autoliikenne.indeksi),
          haitanKesto: Math.max(
            acc.autoliikenne.haitanKesto,
            haittaindeksi.autoliikenne.haitanKesto,
          ),
          katuluokka: Math.max(acc.autoliikenne.katuluokka, haittaindeksi.autoliikenne.katuluokka),
          liikennemaara: Math.max(
            acc.autoliikenne.liikennemaara,
            haittaindeksi.autoliikenne.liikennemaara,
          ),
          kaistahaitta: Math.max(
            acc.autoliikenne.kaistahaitta,
            haittaindeksi.autoliikenne.kaistahaitta,
          ),
          kaistapituushaitta: Math.max(
            acc.autoliikenne.kaistapituushaitta,
            haittaindeksi.autoliikenne.kaistapituushaitta,
          ),
        },
        linjaautoliikenneindeksi: Math.max(
          acc.linjaautoliikenneindeksi,
          haittaindeksi.linjaautoliikenneindeksi,
        ),
        raitioliikenneindeksi: Math.max(
          acc.raitioliikenneindeksi,
          haittaindeksi.raitioliikenneindeksi,
        ),
      };
    },
    {
      liikennehaittaindeksi: {
        indeksi: 0,
        tyyppi: HAITTA_INDEX_TYPE.PYORALIIKENNEINDEKSI,
      },
      pyoraliikenneindeksi: 0,
      autoliikenne: {
        indeksi: 0,
        haitanKesto: 0,
        katuluokka: 0,
        liikennemaara: 0,
        kaistahaitta: 0,
        kaistapituushaitta: 0,
      },
      linjaautoliikenneindeksi: 0,
      raitioliikenneindeksi: 0,
    },
  );
}
