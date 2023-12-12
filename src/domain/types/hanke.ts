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
  EI_VAIKUTA = 'EI_VAIKUTA',
  VAHENTAA_KAISTAN_YHDELLA_AJOSUUNNALLA = 'VAHENTAA_KAISTAN_YHDELLA_AJOSUUNNALLA',
  VAHENTAA_SAMANAIKAISESTI_KAISTAN_KAHDELLA_AJOSUUNNALLA = 'VAHENTAA_SAMANAIKAISESTI_KAISTAN_KAHDELLA_AJOSUUNNALLA',
  VAHENTAA_SAMANAIKAISESTI_USEITA_KAISTOJA_KAHDELLA_AJOSUUNNALLA = 'VAHENTAA_SAMANAIKAISESTI_USEITA_KAISTOJA_KAHDELLA_AJOSUUNNALLA',
  VAHENTAA_SAMANAIKAISESTI_USEITA_KAISTOJA_LIITTYMIEN_ERI_SUUNNILLA = 'VAHENTAA_SAMANAIKAISESTI_USEITA_KAISTOJA_LIITTYMIEN_ERI_SUUNNILLA',
}
export type HANKE_KAISTAHAITTA_KEY = keyof typeof HANKE_KAISTAHAITTA;

export enum HANKE_KAISTAPITUUSHAITTA {
  EI_VAIKUTA_KAISTAJARJESTELYIHIN = 'EI_VAIKUTA_KAISTAJARJESTELYIHIN',
  KAISTAVAIKUTUSTEN_PITUUS_ALLE_10_METRIA = 'KAISTAVAIKUTUSTEN_PITUUS_ALLE_10_METRIA',
  KAISTAVAIKUTUSTEN_PITUUS_10_99_METRIA = 'KAISTAVAIKUTUSTEN_PITUUS_10_99_METRIA',
  KAISTAVAIKUTUSTEN_PITUUS_100_499_METRIA = 'KAISTAVAIKUTUSTEN_PITUUS_100_499_METRIA',
  VIKAISTAVAIKUTUSTEN_PITUUS_500_METRIA_TAI_ENEMMAN = 'VIKAISTAVAIKUTUSTEN_PITUUS_500_METRIA_TAI_ENEMMAN',
}
export type HANKE_KAISTAPITUUSHAITTA_KEY = keyof typeof HANKE_KAISTAPITUUSHAITTA;

export enum HANKE_MELUHAITTA {
  SATUNNAINEN_HAITTA = 'SATUNNAINEN_HAITTA',
  LYHYTAIKAINEN_TOISTUVA_HAITTA = 'LYHYTAIKAINEN_TOISTUVA_HAITTA',
  PITKAKESTOINEN_TOISTUVA_HAITTA = 'PITKAKESTOINEN_TOISTUVA_HAITTA',
}
export type HANKE_MELUHAITTA_KEY = keyof typeof HANKE_MELUHAITTA;

export enum HANKE_POLYHAITTA {
  SATUNNAINEN_HAITTA = 'SATUNNAINEN_HAITTA',
  LYHYTAIKAINEN_TOISTUVA_HAITTA = 'LYHYTAIKAINEN_TOISTUVA_HAITTA',
  PITKAKESTOINEN_TOISTUVA_HAITTA = 'PITKAKESTOINEN_TOISTUVA_HAITTA',
}
export type HANKE_POLYHAITTA_KEY = keyof typeof HANKE_POLYHAITTA;

export enum HANKE_TARINAHAITTA {
  SATUNNAINEN_HAITTA = 'SATUNNAINEN_HAITTA',
  LYHYTAIKAINEN_TOISTUVA_HAITTA = 'LYHYTAIKAINEN_TOISTUVA_HAITTA',
  PITKAKESTOINEN_TOISTUVA_HAITTA = 'PITKAKESTOINEN_TOISTUVA_HAITTA',
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
  alikontaktit: HankeSubContact[];
}

export type HankeMuuTaho = {
  rooli: string;
  nimi: string;
  organisaatioNimi: string;
  osasto: string;
  email: string;
  puhelinnumero?: string;
  alikontaktit: HankeSubContact[];
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
  haittaAlkuPvm: string | null;
  haittaLoppuPvm: string | null;
  kaistaHaitta: HANKE_KAISTAHAITTA_KEY | null;
  kaistaPituusHaitta: HANKE_KAISTAPITUUSHAITTA_KEY | null;
  meluHaitta: HANKE_MELUHAITTA_KEY | null;
  polyHaitta: HANKE_POLYHAITTA | null;
  tarinaHaitta: HANKE_TARINAHAITTA_KEY | null;
  nimi?: string | null;
};

export enum HANKE_INDEX_TYPE {
  AUTOLIIKENNEINDEKSI = 'AUTOLIIKENNEINDEKSI',
}

export type Liikennehaittaindeksi = {
  indeksi: number;
  tyyppi: HANKE_INDEX_TYPE.AUTOLIIKENNEINDEKSI;
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
  omistajat: Array<HankeContact>;
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
  generated?: boolean;
}

export interface HankeIndexData {
  hankeTunnus: string;
  hankeId: number;
  hankeGeometriatId: number;
  liikennehaittaindeksi: Liikennehaittaindeksi;
  autoliikenneindeksi: number;
  pyoraliikenneindeksi: number;
  linjaautoliikenneindeksi: number;
  raitioliikenneindeksi: number;
  tila: HANKE_INDEX_STATE_KEY;
}

type DraftRequiredFields = 'nimi' | 'kuvaus' | 'vaihe';

export type HankeDataDraft = PartialExcept<HankeData, DraftRequiredFields>;
