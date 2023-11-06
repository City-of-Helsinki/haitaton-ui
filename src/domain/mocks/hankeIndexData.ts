import { HankeIndexData, HANKE_INDEX_TYPE, HANKE_INDEX_STATE } from '../types/hanke';

const hankeIndexData: HankeIndexData = {
  hankeTunnus: 'HAI21-35',
  hankeId: 62,
  hankeGeometriatId: 52,
  liikennehaittaIndeksi: {
    indeksi: 4,
    tyyppi: HANKE_INDEX_TYPE.PERUSINDEKSI,
  },
  perusIndeksi: 4,
  pyorailyIndeksi: 3,
  linjaautoIndeksi: 2,
  raitiovaunuIndeksi: 1,
  tila: HANKE_INDEX_STATE.VOIMASSA,
};

export default hankeIndexData;
