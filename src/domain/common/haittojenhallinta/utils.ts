import { HAITTA_INDEX_TYPE, HaittaIndexData } from '../haittaIndexes/types';
import { HAITTOJENHALLINTATYYPPI } from './types';

function getHaittaIndexValue(v: number | { indeksi: number }): number {
  return typeof v === 'number' ? v : v.indeksi;
}

/**
 * Sorts HAITTOJENHALLINTATYYPPI based on given tormaystarkasteluTulos.
 * For example, if tormaystarkasteluTulos has {autoliikenneindeksi: 1.0, pyoraliiikenneindeksi: 1.3, linjaautoliikenneindeksi: 0.0, raitioliikenneindeksi: 0.0},
 * the result will be [[PYORALIIKENNE, 1.3], [AUTOLIIKENNE, 1.0], [LINJAAUTOLIIKENNE, 0.0], [RAITIOLIIKENNE, 0.0]].
 */
export function sortedLiikenneHaittojenhallintatyyppi(
  tormaystarkasteluTulos: HaittaIndexData | undefined,
): [HAITTOJENHALLINTATYYPPI, number][] {
  const defaultOrder = Object.values(HAITTOJENHALLINTATYYPPI).filter(
    (type) => type !== HAITTOJENHALLINTATYYPPI.YLEINEN && type !== HAITTOJENHALLINTATYYPPI.MUUT,
  );
  if (!tormaystarkasteluTulos) {
    return defaultOrder.map((type) => [type, 0] as [HAITTOJENHALLINTATYYPPI, number]);
  }

  function keyOfIndexType(key: HAITTA_INDEX_TYPE): keyof HaittaIndexData {
    if (key === HAITTA_INDEX_TYPE.AUTOLIIKENNEINDEKSI) {
      return 'autoliikenne';
    }
    return key.toLowerCase() as keyof HaittaIndexData;
  }

  const sortedIndices = Object.values(HAITTA_INDEX_TYPE)
    .map((key) => ({
      type: key.toUpperCase().replace('INDEKSI', '') as HAITTOJENHALLINTATYYPPI,
      value: getHaittaIndexValue(tormaystarkasteluTulos[keyOfIndexType(key)]),
    }))
    .sort((a, b): number => {
      const diff = b.value - a.value;
      if (diff === 0) {
        return defaultOrder.indexOf(a.type) - defaultOrder.indexOf(b.type);
      }
      return diff;
    });

  return sortedIndices.map((item) => [item.type, item.value] as [HAITTOJENHALLINTATYYPPI, number]);
}

export function mapNuisanceEnumIndexToNuisanceIndex(index: number): number {
  if (index === 2) return 3;
  if (index === 3) return 5;
  return index;
}

/**
 * Get haitta index value for given haittojenhallinta tyyppi from tormaystarkasteluTulos
 */
export function getHaittaIndexForTyyppi(
  tormaystarkasteluTulos: HaittaIndexData | null | undefined,
  haittojenhallintaTyyppi: HAITTOJENHALLINTATYYPPI,
) {
  if (!tormaystarkasteluTulos) {
    return 0;
  }

  function getKeyOfHaittaIndexTyyppi(tyyppi: HAITTOJENHALLINTATYYPPI): keyof HaittaIndexData {
    if (tyyppi === HAITTOJENHALLINTATYYPPI.AUTOLIIKENNE) {
      return 'autoliikenne';
    }
    return `${tyyppi.toLowerCase()}indeksi` as keyof HaittaIndexData;
  }

  return getHaittaIndexValue(
    tormaystarkasteluTulos[getKeyOfHaittaIndexTyyppi(haittojenhallintaTyyppi)],
  );
}
