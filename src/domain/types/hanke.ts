import { HankeGeoJSON } from '../../common/types/hanke';

export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<T>;

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

export enum HANKE_TYOMAATYYPPI {
  VESI = 'VESI',
  VIEMARI = 'VIEMARI',
  SADEVESI = 'SADEVESI',
  SAHKO = 'SAHKO',
  TIETOLIIKENNE = 'TIETOLIIKENNE',
  LIIKENNEVALO = 'LIIKENNEVALO',
  YKT = 'YKT',
  ULKOVALAISTUS = 'ULKOVALAISTUS',
  KAAPPITYO = 'KAAPPITYO',
  KAUKOLAMPO = 'KAUKOLAMPO',
  KAUKOKYLMA = 'KAUKOKYLMA',
  KAASUJOHTO = 'KAASUJOHTO',
  KISKOTYO = 'KISKOTYO',
  MUU = 'MUU',
  KADUNRAKENNUS = 'KADUNRAKENNUS',
  KADUN_KUNNOSSAPITO = 'KADUN_KUNNOSSAPITO',
  KIINTEISTOLIITTYMA = 'KIINTEISTOLIITTYMA',
  SULKU_TAI_KAIVO = 'SULKU_TAI_KAIVO',
  UUDISRAKENNUS = 'UUDISRAKENNUS',
  SANEERAUS = 'SANEERAUS',
  AKILLINEN_VIKAKORJAUS = 'AKILLINEN_VIKAKORJAUS',
  VIHERTYO = 'VIHERTYO',
  RUNKOLINJA = 'RUNKOLINJA',
  NOSTOTYO = 'NOSTOTYO',
  MUUTTO = 'MUUTTO',
  PYSAKKITYO = 'PYSAKKITYO',
  KIINTEISTOREMONTTI = 'KIINTEISTOREMONTTI',
  ULKOMAINOS = 'ULKOMAINOS',
  KUVAUKSET = 'KUVAUKSET',
  LUMENPUDOTUS = 'LUMENPUDOTUS',
  YLEISOTILAISUUS = 'YLEISOTILAISUUS',
  VAIHTOLAVA = 'VAIHTOLAVA',
}
export type HANKE_TYOMAATYYPPI_KEY = keyof typeof HANKE_TYOMAATYYPPI;

export enum HANKE_TYOMAAKOKO {
  SUPPEA_TAI_PISTE = 'SUPPEA_TAI_PISTE',
  YLI_10M_TAI_KORTTELI = 'YLI_10M_TAI_KORTTELI',
  LAAJA_TAI_USEA_KORTTELI = 'LAAJA_TAI_USEA_KORTTELI',
}
export type HANKE_TYOMAAKOKO_KEY = keyof typeof HANKE_TYOMAAKOKO;

export enum HANKE_KAISTAHAITTA {
  EI_VAIKUTA = 'EI_VAIKUTA',
  YKSI = 'YKSI',
  KAKSI = 'KAKSI',
  KOLME = 'KOLME',
  NELJA = 'NELJA',
}
export type HANKE_KAISTAHAITTA_KEY = keyof typeof HANKE_KAISTAHAITTA;

export enum HANKE_KAISTAPITUUSHAITTA {
  EI_VAIKUTA = 'EI_VAIKUTA',
  YKSI = 'YKSI',
  KAKSI = 'KAKSI',
  KOLME = 'KOLME',
  NELJA = 'NELJA',
}
export type HANKE_KAISTAPITUUSHAITTA_KEY = keyof typeof HANKE_KAISTAPITUUSHAITTA;

export enum HANKE_MELUHAITTA {
  YKSI = 'YKSI',
  KAKSI = 'KAKSI',
  KOLME = 'KOLME',
}
export type HANKE_MELUHAITTA_KEY = keyof typeof HANKE_MELUHAITTA;

export enum HANKE_POLYAITTA {
  YKSI = 'YKSI',
  KAKSI = 'KAKSI',
  KOLME = 'KOLME',
}
export type HANKE_POLYAITTA_KEY = keyof typeof HANKE_POLYAITTA;

export enum HANKE_TARINAHAITTA {
  YKSI = 'YKSI',
  KAKSI = 'KAKSI',
  KOLME = 'KOLME',
}
export type HANKE_TARINAHAITTA_KEY = keyof typeof HANKE_TARINAHAITTA;

export type HankeContact = {
  id: number | null;
  sukunimi: string;
  etunimi: string;
  email: string;
  puhelinnumero: string;
  organisaatioId: number | null;
  organisaatioNimi: string;
  osasto: string;
};

export type HANKKEEN_GEOMETRIAT = {
  createdAt: Date;
  createdByUserId: string;
  featureCollection: HankeGeoJSON;
  hankeId: number;
  id: number;
  modifiedAt: Date;
  modifiedByUserId: string;
};

export type HankeData = {
  id: number;
  hankeTunnus: string;
  nimi: string;
  kuvaus: string;
  // https://github.com/reduxjs/redux-toolkit/issues/456
  alkuPvm: string;
  loppuPvm: string;
  tyomaaKatuosoite: string;
  vaihe: HANKE_VAIHE_KEY;
  suunnitteluVaihe: HANKE_SUUNNITTELUVAIHE_KEY | null;
  tyomaaTyyppi: HANKE_TYOMAATYYPPI_KEY[];
  tyomaaKoko: HANKE_TYOMAAKOKO_KEY;
  haittaAlkuPvm: Date;
  haittaLoppuPvm: Date;
  kaistaHaitta: HANKE_KAISTAHAITTA_KEY;
  kaistaPituusHaitta: HANKE_KAISTAPITUUSHAITTA_KEY;
  meluHaitta: HANKE_MELUHAITTA_KEY;
  polyHaitta: HANKE_POLYAITTA_KEY;
  tarinaHaitta: HANKE_TARINAHAITTA_KEY;
  omistajat: Array<HankeContact>;
  arvioijat: Array<HankeContact>;
  toteuttajat: Array<HankeContact>;
  onYKTHanke: boolean;
  geometriat: HANKKEEN_GEOMETRIAT | null;
};
export type HankeDatainitialData = {
  initialData: Array<HankeData>;
};
