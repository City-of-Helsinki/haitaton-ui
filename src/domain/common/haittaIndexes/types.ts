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

export type Autoliikennehaittaluokittelu = {
  indeksi: number;
  haitanKesto: number;
  katuluokka: number;
  liikennemaara: number;
  kaistahaitta: number;
  kaistapituushaitta: number;
};

export interface HaittaIndexData {
  liikennehaittaindeksi: Liikennehaittaindeksi;
  autoliikenne: Autoliikennehaittaluokittelu;
  pyoraliikenneindeksi: number;
  linjaautoliikenneindeksi: number;
  raitioliikenneindeksi: number;
}
