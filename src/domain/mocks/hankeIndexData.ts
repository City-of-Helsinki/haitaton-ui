import { HankeIndexData, HANKE_INDEX_TYPE } from '../types/hanke';

const hankeIndexData: HankeIndexData = {
  liikennehaittaindeksi: {
    indeksi: 4,
    tyyppi: HANKE_INDEX_TYPE.AUTOLIIKENNEINDEKSI,
  },
  autoliikenneindeksi: 4,
  pyoraliikenneindeksi: 3,
  linjaautoliikenneindeksi: 2,
  raitioliikenneindeksi: 1,
};

export default hankeIndexData;
