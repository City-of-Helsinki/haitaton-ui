export interface HakemusFormValues {
  hankeTunnus: string;
  onYKTHanke: boolean;
  nimi: string;
  kuvaus: string;
  alkuPvm: string;
  loppuPvm: string;
  vaihe: HANKE_VAIHE_KEY | '';
  suunnitteluVaihe: HANKE_SUUNNITTELUVAIHE_KEY | null;
  hakijanNimi: string;
}

export enum HANKE_VAIHE {
  OHJELMOINTI = 'OHJELMOINTI',
  SUUNNITTELU = 'SUUNNITTELU',
  RAKENTAMINEN = 'RAKENTAMINEN',
}

export type HANKE_VAIHE_KEY = keyof typeof HANKE_VAIHE;

export enum HANKE_SUUNNITTELUVAIHE {
  YLEIS_TAI_HANKE = 'YLEIS_TAI_HANKE',
  KATUSUUNNITTELU_TAI_ALUEVARAUS = 'KATUSUUNNITTELU_TAI_ALUEVARAUS',
  RAKENNUS_TAI_TOTEUTUS = 'RAKENNUS_TAI_TOTEUTUS',
  TYOMAAN_TAI_HANKKEEN_AIKAINEN = 'TYOMAAN_TAI_HANKKEEN_AIKAINEN',
}
export type HANKE_SUUNNITTELUVAIHE_KEY = keyof typeof HANKE_SUUNNITTELUVAIHE;
