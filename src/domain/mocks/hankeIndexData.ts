import { HAITTA_INDEX_TYPE, HaittaIndexData } from '../common/haittaIndexes/types';

const hankeIndexData: HaittaIndexData = {
  liikennehaittaindeksi: {
    indeksi: 4,
    tyyppi: HAITTA_INDEX_TYPE.AUTOLIIKENNEINDEKSI,
  },
  autoliikenne: {
    indeksi: 4,
    haitanKesto: 1,
    katuluokka: 4,
    liikennemaara: 4,
    kaistahaitta: 4,
    kaistapituushaitta: 4,
  },
  pyoraliikenneindeksi: 3,
  linjaautoliikenneindeksi: 2,
  raitioliikenneindeksi: 1,
};

export default hankeIndexData;
