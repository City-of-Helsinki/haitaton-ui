import { PartialExcept } from '../../common/types/utils';
import { HankeGeoJSON } from '../../common/types/hanke';

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

export enum HANKE_SAVETYPE {
  AUTO = 'AUTO',
  DRAFT = 'DRAFT',
  SUBMIT = 'SUBMIT',
}
export type HANKE_SAVETYPE_KEY = keyof typeof HANKE_SAVETYPE;

export enum HANKE_CONTACT_TYPE {
  OMISTAJA = 'omistaja',
  RAKENNUTTAJAT = 'rakennuttajat',
  TOTEUTTAJAT = 'toteuttajat',
  MUUTTAHOT = 'muutTahot',
}
export type HankeContactTypeKey =
  | HANKE_CONTACT_TYPE.OMISTAJA
  | HANKE_CONTACT_TYPE.RAKENNUTTAJAT
  | HANKE_CONTACT_TYPE.TOTEUTTAJAT
  | HANKE_CONTACT_TYPE.MUUTTAHOT;

export interface HankeSubContact {
  nimi: string;
  osoite?: string;
  postiNro?: string;
  postiToimiPaikka?: string;
  email: string;
  puhelinnumero: string;
}

export interface HankeContact extends HankeSubContact {
  id: number | null;
  tyyppi: keyof typeof CONTACT_TYYPPI | null;
  tunnus: string;
}

export interface HankeOmistaja extends HankeContact {
  subContact?: HankeSubContact;
}

export interface HankeRakennuttaja extends HankeContact {
  subContacts?: HankeSubContact[];
}

export type HankeMuuTaho = {
  rooli: string;
  nimi: string;
  organisaatio: string;
  osasto: string;
  email: string;
  puhelinnumero?: string;
  subContacts: HankeSubContact[];
};

export enum CONTACT_TYYPPI {
  YKSITYISHENKILO = 'YKSITYISHENKILO',
  YRITYS = 'YRITYS',
  YHTEISO = 'YHTEISO',
}

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

export enum HANKE_INDEX_TYPE {
  PERUSINDEKSI = 'PERUSINDEKSI',
}

export type LiikenneHaittaIndeksi = {
  indeksi: number;
  tyyppi: HANKE_INDEX_TYPE.PERUSINDEKSI;
};

export enum HANKE_INDEX_STATE {
  VOIMASSA = 'VOIMASSA',
}

export type HANKE_INDEX_STATE_KEY = keyof typeof HANKE_INDEX_STATE;

export interface HankeData {
  id: number;
  hankeTunnus: string;
  onYKTHanke: boolean;
  nimi: string;
  kuvaus: string;
  alkuPvm: string;
  loppuPvm: string;
  vaihe: HANKE_VAIHE_KEY;
  suunnitteluVaihe: HANKE_SUUNNITTELUVAIHE_KEY | null;
  tyomaaKatuosoite: string | null;
  tyomaaTyyppi: HANKE_TYOMAATYYPPI_KEY[];
  tyomaaKoko: HANKE_TYOMAAKOKO_KEY | null;
  haittaAlkuPvm: string | null;
  haittaLoppuPvm: string | null;
  kaistaHaitta: HANKE_KAISTAHAITTA_KEY | null;
  kaistaPituusHaitta: HANKE_KAISTAPITUUSHAITTA_KEY | null;
  meluHaitta: HANKE_MELUHAITTA_KEY | null;
  polyHaitta: HANKE_POLYHAITTA | null;
  tarinaHaitta: HANKE_TARINAHAITTA_KEY | null;
  geometriat: HankeGeometria | null;
  liikennehaittaindeksi: LiikenneHaittaIndeksi | null;
  omistaja?: HankeOmistaja | null;
  rakennuttajat: Array<HankeRakennuttaja>;
  toteuttajat: Array<HankeRakennuttaja>;
  muutTahot: Array<HankeMuuTaho>;
  tormaystarkasteluTulos: HankeIndexData | null;
  saveType: HANKE_SAVETYPE_KEY;
  version?: number;
  createdBy?: string;
  createdAt?: string;
  modifiedBy?: null | string;
  modifiedAt?: null | string;
}

export interface HankeIndexData {
  hankeTunnus: string;
  hankeId: number;
  hankeGeometriatId: number;
  liikennehaittaIndeksi: LiikenneHaittaIndeksi;
  perusIndeksi: number;
  pyorailyIndeksi: number;
  joukkoliikenneIndeksi: number;
  tila: HANKE_INDEX_STATE_KEY;
}

type DraftRequiredFields = 'nimi' | 'kuvaus' | 'vaihe' | 'alkuPvm' | 'loppuPvm';

export type HankeDataDraft = PartialExcept<HankeData, DraftRequiredFields>;
