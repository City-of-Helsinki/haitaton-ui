import { HankeGeoJSON } from '../../../common/types/hanke';

export interface Option {
  value: string;
  label: string;
}

export interface HakemusFormValues {
  id: number | null;
  hankeTunnus: string;
  onYKTHanke: boolean;
  nimi: string;
  kuvaus: string;
  alkuPvm: string;
  loppuPvm: string;
  vaihe: HANKE_VAIHE_KEY | '';
  suunnitteluVaihe: HANKE_SUUNNITTELUVAIHE_KEY | null;
  tyomaaKatuosoite: string;
  tyomaaTyyppi: Array<HANKE_TYOMAATYYPPI_KEY>;
  tyomaaKoko: HANKE_TYOMAAKOKO_KEY | null;
  haittaAlkuPvm: string;
  haittaLoppuPvm: string;
  kaistaHaitta: HANKE_KAISTAHAITTA_KEY | null;
  kaistaPituusHaitta: HANKE_KAISTAPITUUSHAITTA_KEY | null;
  meluHaitta: HANKE_MELUHAITTA_KEY | null;
  polyHaitta: HANKE_POLYHAITTA | null;
  tarinaHaitta: HANKE_TARINAHAITTA_KEY | null;
  geometriat: HankeGeometria | null;
  liikennehaittaindeksi: LiikenneHaittaIndeksi | null; // TODO: miksi tämä on olemassa?
  omistajat: Array<HankeContact>;
  arvioijat: Array<HankeContact>;
  toteuttajat: Array<HankeContact>;
  tormaystarkasteluTulos: HankeIndexData | null;
  permissions: null; // TODO: add permissions into typedef correctly
  saveType: HANKE_SAVETYPE_KEY;
  createdBy: null | string;
  createdAt: null | string;
  modifiedBy: null | string;
  modifiedAt: null | string;
  version: null | number;
}

export type LiikenneHaittaIndeksi = {
  indeksi: number;
  tyyppi: HANKE_INDEX_TYPE.PERUSINDEKSI; // TODO: Miksi tämä on olemassa?
};

export interface HankeIndexData {
  hankeTunnus: string;
  hankeId: number;
  hankeGeometriatId: number;
  liikennehaittaIndeksi: LiikenneHaittaIndeksi;
  perusIndeksi: number;
  pyorailyIndeksi: number;
  joukkoliikenneIndeksi: number;
  // TODO: onko tätä olemassa? tila: HANKE_INDEX_STATE_KEY;
}

export enum HANKE_INDEX_TYPE {
  PERUSINDEKSI = 'PERUSINDEKSI',
}

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

export enum HANKE_KAISTAHAITTA {
  YKSI = 'YKSI',
  KAKSI = 'KAKSI',
  KOLME = 'KOLME',
  NELJA = 'NELJA',
  VIISI = 'VIISI',
}
export type HANKE_KAISTAHAITTA_KEY = keyof typeof HANKE_KAISTAHAITTA;

export enum HANKE_KAISTAPITUUSHAITTA {
  YKSI = 'YKSI',
  KAKSI = 'KAKSI',
  KOLME = 'KOLME',
  NELJA = 'NELJA',
  VIISI = 'VIISI',
}
export type HANKE_KAISTAPITUUSHAITTA_KEY = keyof typeof HANKE_KAISTAPITUUSHAITTA;

export enum HANKE_MELUHAITTA {
  YKSI = 'YKSI',
  KAKSI = 'KAKSI',
  KOLME = 'KOLME',
}
export type HANKE_MELUHAITTA_KEY = keyof typeof HANKE_MELUHAITTA;

export enum HANKE_POLYHAITTA {
  YKSI = 'YKSI',
  KAKSI = 'KAKSI',
  KOLME = 'KOLME',
}
export type HANKE_POLYHAITTA_KEY = keyof typeof HANKE_POLYHAITTA;

export enum HANKE_TARINAHAITTA {
  YKSI = 'YKSI',
  KAKSI = 'KAKSI',
  KOLME = 'KOLME',
}
export type HANKE_TARINAHAITTA_KEY = keyof typeof HANKE_TARINAHAITTA;

export type HankeGeometria = {
  featureCollection: HankeGeoJSON;
  hankeId: number;
  id: number;
  modifiedAt: string | null;
  version: number | null;
  createdByUserId: string | null;
  createdAt: string | null;
  modifiedByUserId: string | null;
};

export enum HANKE_CONTACT_TYPE {
  OMISTAJAT = 'omistajat',
  ARVIOIJAT = 'arvioijat',
  TOTEUTTAJAT = 'toteuttajat',
}

export type HANKE_CONTACT_KEY =
  | HANKE_CONTACT_TYPE.OMISTAJAT
  | HANKE_CONTACT_TYPE.ARVIOIJAT
  | HANKE_CONTACT_TYPE.TOTEUTTAJAT;

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

export enum HANKE_SAVETYPE {
  AUTO = 'AUTO',
  DRAFT = 'DRAFT',
  SUBMIT = 'SUBMIT',
}
export type HANKE_SAVETYPE_KEY = keyof typeof HANKE_SAVETYPE;
