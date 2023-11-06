import { PartialExcept } from '../../common/types/utils';
import { HankeGeoJSON } from '../../common/types/hanke';

export enum HANKE_VAIHE {
  OHJELMOINTI = 'OHJELMOINTI',
  SUUNNITTELU = 'SUUNNITTELU',
  RAKENTAMINEN = 'RAKENTAMINEN',
}
export type HANKE_VAIHE_KEY = keyof typeof HANKE_VAIHE;

export enum HANKE_TYOMAATYYPPI {
  VESI = 'VESI',
  VIEMARI = 'VIEMARI',
  SADEVESI = 'SADEVESI',
  SAHKO = 'SAHKO',
  TIETOLIIKENNE = 'TIETOLIIKENNE',
  LIIKENNEVALO = 'LIIKENNEVALO',
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

export enum HANKE_CONTACT_TYPE {
  OMISTAJAT = 'omistajat',
  RAKENNUTTAJAT = 'rakennuttajat',
  TOTEUTTAJAT = 'toteuttajat',
  MUUTTAHOT = 'muut',
}
export type HankeContactTypeKey =
  | HANKE_CONTACT_TYPE.OMISTAJAT
  | HANKE_CONTACT_TYPE.RAKENNUTTAJAT
  | HANKE_CONTACT_TYPE.TOTEUTTAJAT
  | HANKE_CONTACT_TYPE.MUUTTAHOT;

export interface HankeSubContact {
  etunimi: string;
  sukunimi: string;
  email: string;
  puhelinnumero: string;
}

export interface HankeContact {
  id: number | null;
  tyyppi: keyof typeof CONTACT_TYYPPI | null;
  nimi: string;
  email: string;
  puhelinnumero: string;
  ytunnus: string | null;
  alikontaktit?: HankeSubContact[];
}

export type HankeMuuTaho = {
  rooli: string;
  nimi: string;
  organisaatioNimi: string;
  osasto: string;
  email: string;
  puhelinnumero?: string;
  alikontaktit?: HankeSubContact[];
};

export type HankeContacts = Array<(HankeContact | HankeMuuTaho)[] | undefined>;

export function isHankeContact(contact: HankeContact | HankeMuuTaho): contact is HankeContact {
  return (contact as HankeContact).ytunnus !== undefined;
}

export enum CONTACT_TYYPPI {
  YKSITYISHENKILO = 'YKSITYISHENKILO',
  YRITYS = 'YRITYS',
  YHTEISO = 'YHTEISO',
}

export type HankeGeometria = {
  featureCollection: HankeGeoJSON;
  id?: number;
  modifiedAt?: string | null;
  version?: number | null;
  createdByUserId?: string | null;
  createdAt?: string | null;
  modifiedByUserId?: string | null;
};

export type HankeAlue = {
  id: number | null;
  hankeId?: number;
  geometriat?: HankeGeometria;
  haittaAlkuPvm: string;
  haittaLoppuPvm: string;
  kaistaHaitta: HANKE_KAISTAHAITTA_KEY | null;
  kaistaPituusHaitta: HANKE_KAISTAPITUUSHAITTA_KEY | null;
  meluHaitta: HANKE_MELUHAITTA_KEY | null;
  polyHaitta: HANKE_POLYHAITTA | null;
  tarinaHaitta: HANKE_TARINAHAITTA_KEY | null;
  nimi?: string | null;
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

enum HANKE_STATUS {
  DRAFT = 'DRAFT',
  PUBLIC = 'PUBLIC',
  ENDED = 'ENDED',
}

type HANKE_STATUS_KEY = keyof typeof HANKE_STATUS;

export interface HankeData {
  id: number;
  hankeTunnus: string;
  onYKTHanke: boolean;
  nimi: string;
  kuvaus: string;
  alkuPvm: string;
  loppuPvm: string;
  vaihe: HANKE_VAIHE_KEY;
  tyomaaKatuosoite: string | null;
  tyomaaTyyppi: HANKE_TYOMAATYYPPI_KEY[];
  alueet: HankeAlue[];
  liikennehaittaindeksi: LiikenneHaittaIndeksi | null;
  omistajat?: Array<HankeContact>;
  rakennuttajat: Array<HankeContact>;
  toteuttajat: Array<HankeContact>;
  muut: Array<HankeMuuTaho>;
  tormaystarkasteluTulos: HankeIndexData | null;
  status: HANKE_STATUS_KEY;
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
  linjaautoIndeksi: number;
  raitiovaunuIndeksi: number;
  tila: HANKE_INDEX_STATE_KEY;
}

type DraftRequiredFields = 'nimi' | 'kuvaus' | 'vaihe';

export type HankeDataDraft = PartialExcept<HankeData, DraftRequiredFields>;
