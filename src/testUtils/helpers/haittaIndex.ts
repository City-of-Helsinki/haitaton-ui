import { HAITTA_INDEX_TYPE, HaittaIndexData } from '../../domain/common/haittaIndexes/types';
import { initHaittaindeksitPostResponse } from '../helperFunctions';

/**
 * Mock haitta indices POST response with deterministic values.
 * Accepts a partial HaittaIndexData; unspecified numeric indices default to 0 and
 * required nested objects are synthesized with minimal valid defaults.
 *
 * Reusable across tests needing stable haitta index data without repeating boilerplate.
 */
export function mockHaittaIndex({
  liikennehaittaindeksi,
  pyoraliikenneindeksi = 0,
  autoliikenne,
  linjaautoliikenneindeksi = 0,
  raitioliikenneindeksi = 0,
}: Partial<HaittaIndexData> = {}) {
  const resolvedLiikennehaitta = liikennehaittaindeksi ?? {
    indeksi: 0,
    tyyppi: HAITTA_INDEX_TYPE.AUTOLIIKENNEINDEKSI,
  };
  const resolvedAutoliikenne = autoliikenne ?? {
    indeksi: 0,
    haitanKesto: 0,
    katuluokka: 0,
    liikennemaara: 0,
    kaistahaitta: 0,
    kaistapituushaitta: 0,
  };
  initHaittaindeksitPostResponse({
    liikennehaittaindeksi: resolvedLiikennehaitta,
    pyoraliikenneindeksi,
    autoliikenne: resolvedAutoliikenne,
    linjaautoliikenneindeksi,
    raitioliikenneindeksi,
  });
}
