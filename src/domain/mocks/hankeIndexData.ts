import { HAITTA_INDEX_TYPE, HaittaIndexData } from '../common/haittaIndexes/types';

const hankeIndexData: HaittaIndexData = {
  liikennehaittaindeksi: {
    indeksi: 4,
    tyyppi: HAITTA_INDEX_TYPE.AUTOLIIKENNEINDEKSI,
  },
  autoliikenneindeksi: 4,
  pyoraliikenneindeksi: 3,
  linjaautoliikenneindeksi: 2,
  raitioliikenneindeksi: 1,
};

export default hankeIndexData;
