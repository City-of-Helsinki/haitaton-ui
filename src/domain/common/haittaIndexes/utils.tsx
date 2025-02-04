import { HaittaIndexData } from './types';

// Check if any of the haitta indexes have increased
export function haveHaittaIndexesIncreased(
  data: HaittaIndexData,
  previousData?: HaittaIndexData | null,
) {
  if (!previousData) {
    return false;
  }
  return (
    data.autoliikenne.indeksi > previousData.autoliikenne.indeksi ||
    data.linjaautoliikenneindeksi > previousData.linjaautoliikenneindeksi ||
    data.raitioliikenneindeksi > previousData.raitioliikenneindeksi ||
    data.pyoraliikenneindeksi > previousData.pyoraliikenneindeksi
  );
}
