export enum HAITTA_INDEX_TYPE {
  AUTOLIIKENNEINDEKSI = 'AUTOLIIKENNEINDEKSI',
  PYORALIIKENNEINDEKSI = 'PYORALIIKENNEINDEKSI',
  LINJAAUTOLIIKENNEINDEKSI = 'LINJAAUTOLIIKENNEINDEKSI',
  RAITIOLIIKENNEINDEKSI = 'RAITIOLIIKENNEINDEKSI',
}

export type Liikennehaittaindeksi = {
  indeksi: number;
  tyyppi: HAITTA_INDEX_TYPE;
};

export interface HaittaIndexData {
  liikennehaittaindeksi: Liikennehaittaindeksi;
  autoliikenneindeksi: number;
  pyoraliikenneindeksi: number;
  linjaautoliikenneindeksi: number;
  raitioliikenneindeksi: number;
}
