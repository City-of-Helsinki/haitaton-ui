import { FieldErrors, Control } from 'react-hook-form';
import { HankeData } from '../../types/hanke';

export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<T>;

export interface FormProps {
  formData: HankeDataDraft;
  errors: FieldErrors;
  control: Control;
  // eslint-disable-next-line
  register: any;
}

export enum HANKE_SAVETYPE {
  AUTO = 'AUTO',
  DRAFT = 'DRAFT',
  SUBMIT = 'SUBMIT',
}
export type HANKE_SAVETYPE_KEY = keyof typeof HANKE_SAVETYPE;

export enum FORMFIELD {
  TUNNUS = 'hankeTunnus',
  VAIHE = 'vaihe',
  NIMI = 'nimi',
  KUVAUS = 'kuvaus',
  KATUOSOITE = 'tyomaaKatuosoite',
  SUUNNITTELUVAIHE = 'suunnitteluVaihe',
  ALKU_PVM = 'alkuPvm',
  LOPPU_PVM = 'loppuPvm',
  TYOMAATYYPPI = 'tyomaaTyyppi',
  TYOMAAKOKO = 'tyomaaKoko',
  HAITTA_ALKU_PVM = 'haittaAlkuPvm',
  HAITTA_LOPPU_PVM = 'haittaLoppuPvm',
  KAISTAHAITTA = 'kaistaHaitta',
  KAISTAPITUUSHAITTA = 'kaistaPituusHaitta',
  MELUHAITTA = 'meluHaitta',
  POLYHAITTA = 'polyHaitta',
  TARINAHAITTA = 'tarinaHaitta',
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

type DraftRequiredFields =
  | `${FORMFIELD.OMISTAJAT}`
  | `${FORMFIELD.TOTEUTTAJAT}`
  | `${FORMFIELD.ARVIOIJAT}`;

export type HankeDataDraft = PartialExcept<HankeData, DraftRequiredFields>;
