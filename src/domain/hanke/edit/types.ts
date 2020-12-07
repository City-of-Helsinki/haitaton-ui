// eslint-disable-next-line
import { Dispatch, SetStateAction } from 'react';
import { FieldErrors, Control } from 'react-hook-form';

export interface FormProps {
  formData: HankeDataDraft;
  errors: FieldErrors;
  control: Control;
  // eslint-disable-next-line
  register: any;
}
export interface ButtonProps {
  goBack: () => void;
  saveDraftButton: () => void;
  formPage: number;
  isValid: boolean;
}

export enum HANKE_SAVETYPE {
  AUTO = 'AUTO',
  DRAFT = 'DRAFT',
  SUBMIT = 'SUBMIT',
}
export type HANKE_SAVETYPE_KEY = keyof typeof HANKE_SAVETYPE;

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

export enum FORMFIELD {
  TUNNUS = 'hankeTunnus',
  VAIHE = 'vaihe',
  NIMI = 'nimi',
  KATUOSOITE = 'katuosoite',
  SUUNNITTELUVAIHE = 'suunnitteluVaihe',
  ALKU_PVM = 'alkuPvm',
  LOPPU_PVM = 'loppuPvm',
  TYOMAATYYPPI = 'tyomaatyyppi',
  TYOMAAKOKO = 'tyomaakoko',
  HAITTA_ALKU_PVM = 'haittaAlkuPvm',
  HAITTA_LOPPU_PVM = 'haittaLoppuPvm',
  KAISTAHAITTA = 'kaistahaitta',
  KAISTAPITUUSHAITTA = 'kaistapituushaitta',
  MELUHAITTA = 'meluhaitta',
  POLYHAITTA = 'polyhaitta',
  TARINAHAITTA = 'tarinahaitta',
  OMISTAJAT = 'omistajat',
  ARVIOIJAT = 'arvioijat',
  TOTEUTTAJAT = 'toteuttajat',
  YKT_HANKE = 'onYKTHanke',
}

export enum CONTACT_FORMFIELD {
  ID = 'id',
  SUKUNIMI = 'sukunimi',
  ETUNIMI = 'etunimi',
  EMAIL = 'email',
  PUHELINNUMERO = 'puhelinnumero',
  ORGANISAATIO_ID = 'organisaatioId',
  ORGANISAATIO_NIMI = 'organisaatioNimi',
  OSASTO = 'osasto',
}

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

export type HankeData = {
  id: number;
  hankeTunnus: string;
  nimi: string;
  alkuPvm: string;
  loppuPvm: string;
  katuosoite: string;
  vaihe: HANKE_VAIHE_KEY;
  suunnitteluVaihe: HANKE_SUUNNITTELUVAIHE_KEY | null;
  tyomaatyyppi: HANKE_TYOMAATYYPPI_KEY[];
  tyomaakoko: HANKE_TYOMAAKOKO_KEY;
  haittaAlkuPvm: Date;
  haittaLoppuPvm: Date;
  kaistahaitta: HANKE_KAISTAHAITTA_KEY;
  kaistapituushaitta: HANKE_KAISTAPITUUSHAITTA_KEY;
  meluhaitta: HANKE_MELUHAITTA_KEY;
  polyhaitta: HANKE_POLYAITTA_KEY;
  tarinahaitta: HANKE_TARINAHAITTA_KEY;
  omistajat: Array<HankeContact>;
  arvioijat: Array<HankeContact>;
  toteuttajat: Array<HankeContact>;
  onYKTHanke: boolean;
};

export type HankeDataDraft = Partial<HankeData>;
