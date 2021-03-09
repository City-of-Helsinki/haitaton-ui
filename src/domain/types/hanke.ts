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

export enum HANKE_SAVETYPE {
  AUTO = 'AUTO',
  DRAFT = 'DRAFT',
  SUBMIT = 'SUBMIT',
}
export type HANKE_SAVETYPE_KEY = keyof typeof HANKE_SAVETYPE;

export enum HANKE_CONTACT_TYPE {
  OMISTAJAT = 'omistajat',
  ARVIOIJAT = 'arvioijat',
  TOTEUTTAJAT = 'toteuttajat',
}
export type HankeContactKey =
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

export type HankeTilat = {
  onGeometrioita: boolean;
  onKaikkiPakollisetLuontiTiedot: boolean;
  onTiedotLiikenneHaittaIndeksille: boolean;
  onLiikenneHaittaIndeksi: boolean;
  onViereisiaHankkeita: boolean;
  onAsiakasryhmia: boolean;
};

export interface HankeData {
  id: number;
  hankeTunnus: string;
  nimi: string;
  kuvaus: string;
  alkuPvm: string;
  loppuPvm: string;
  tyomaaKatuosoite: string | null;
  vaihe: HANKE_VAIHE_KEY;
  suunnitteluVaihe: HANKE_SUUNNITTELUVAIHE_KEY | null;
  tyomaaTyyppi: HANKE_TYOMAATYYPPI_KEY[];
  tyomaaKoko: HANKE_TYOMAAKOKO_KEY | null;
  haittaAlkuPvm: Date | null;
  haittaLoppuPvm: Date | null;
  kaistaHaitta: HANKE_KAISTAHAITTA_KEY | null;
  kaistaPituusHaitta: HANKE_KAISTAPITUUSHAITTA_KEY | null;
  meluHaitta: HANKE_MELUHAITTA_KEY | null;
  polyHaitta: HANKE_POLYAITTA_KEY | null;
  tarinaHaitta: HANKE_TARINAHAITTA_KEY | null;
  omistajat: Array<HankeContact>;
  arvioijat: Array<HankeContact>;
  toteuttajat: Array<HankeContact>;
  onYKTHanke: boolean;
  saveType: HANKE_SAVETYPE_KEY;
  geometriat: HankeGeometria | null;
  tilat: HankeTilat;
  version?: number;
  createdBy?: string;
  createdAt?: string;
  modifiedBy?: null | string;
  modifiedAt?: null | string;
}

type DraftRequiredFields =
  | 'id'
  | 'hankeTunnus'
  | 'nimi'
  | 'kuvaus'
  | 'vaihe'
  | 'alkuPvm'
  | 'loppuPvm'
  | 'tilat';

export type HankeDataDraft = PartialExcept<HankeData, DraftRequiredFields>;
