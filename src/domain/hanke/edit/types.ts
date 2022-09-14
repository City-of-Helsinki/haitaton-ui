import { FieldErrors } from 'react-hook-form';
import { PartialExcept } from '../../../common/types/utils';
import { HankeData, HankeContactKey } from '../../types/hanke';

export type FormNotification = 'ok' | 'success' | 'error' | null;

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
  GEOMETRIES_CHANGED = 'geometriesChanged',
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
export interface HankeDataFormState extends PartialExcept<HankeData, HankeContactKey> {
  geometriesChanged?: boolean; // "virtualField"
}

export interface FormProps {
  formData: HankeDataFormState;
  errors: FieldErrors;
  // eslint-disable-next-line
  register: any;
}

export type SaveFormArguments = {
  data: HankeDataFormState;
  currentFormPage: number;
};

export type Organization = {
  id: number;
  nimi: string;
  tunnus: string;
};
