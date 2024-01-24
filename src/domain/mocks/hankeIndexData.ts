import { HankeIndexData, HANKE_INDEX_TYPE, HANKE_INDEX_STATE } from '../types/hanke';

const hankeIndexData: HankeIndexData = {
  hankeTunnus: 'HAI21-35',
  hankeId: 62,
  hankeGeometriatId: 52,
  liikennehaittaindeksi: {
    indeksi: 4,
    tyyppi: HANKE_INDEX_TYPE.AUTOLIIKENNEINDEKSI,
  },
  autoliikenneindeksi: 4,
  pyoraliikenneindeksi: 3,
  linjaautoliikenneindeksi: 2,
  raitioliikenneindeksi: 1,
  tila: HANKE_INDEX_STATE.VOIMASSA,
};

export default hankeIndexData;
