import { FieldErrors } from 'react-hook-form';
import { Feature } from 'ol';
import Geometry from 'ol/geom/Geometry';
import { PartialExcept } from '../../../common/types/utils';
import { HankeData, HankeContactTypeKey, HankeAlue } from '../../types/hanke';
import yup from '../../../common/utils/yup';
import { contactPersonSchema, newHankeSchema } from './hankeSchema';

export type FormNotification = 'ok' | 'success' | 'error' | null;

export enum FORMFIELD {
  TUNNUS = 'hankeTunnus',
  VAIHE = 'vaihe',
  NIMI = 'nimi',
  KUVAUS = 'kuvaus',
  KATUOSOITE = 'tyomaaKatuosoite',
  TYOMAATYYPPI = 'tyomaaTyyppi',
  HAITTA_ALKU_PVM = 'haittaAlkuPvm',
  HAITTA_LOPPU_PVM = 'haittaLoppuPvm',
  KAISTAHAITTA = 'kaistaHaitta',
  KAISTAPITUUSHAITTA = 'kaistaPituusHaitta',
  MELUHAITTA = 'meluHaitta',
  POLYHAITTA = 'polyHaitta',
  TARINAHAITTA = 'tarinaHaitta',
  OMISTAJAT = 'omistajat',
  RAKENNUTTAJAT = 'rakennuttajat',
  TOTEUTTAJAT = 'toteuttajat',
  MUUTTAHOT = 'muut',
  YKT_HANKE = 'onYKTHanke',
  GEOMETRIES_CHANGED = 'geometriesChanged',
  GEOMETRIAT = 'geometriat',
  HANKEALUEET = 'alueet',
}

export enum CONTACT_FORMFIELD {
  ID = 'id',
  TYYPPI = 'tyyppi',
  ROOLI = 'rooli',
  NIMI = 'nimi',
  TUNNUS = 'ytunnus',
  EMAIL = 'email',
  PUHELINNUMERO = 'puhelinnumero',
  ORGANISAATIO = 'organisaatioNimi',
  OSASTO = 'osasto',
  ALIKONTAKTIT = 'alikontaktit',
}

export enum CONTACT_PERSON_FORMFIELD {
  ETUNIMI = 'etunimi',
  SUKUNIMI = 'sukunimi',
  EMAIL = 'sahkoposti',
  PUHELINNUMERO = 'puhelinnumero',
}

export interface HankeAlueFormState extends HankeAlue {
  feature?: Feature<Geometry>; // "virtualField"
}

export interface HankeDataFormState extends PartialExcept<HankeData, HankeContactTypeKey> {
  geometriesChanged?: boolean; // "virtualField"
  alueet?: HankeAlueFormState[];
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

export type NewHankeData = yup.InferType<typeof newHankeSchema>;

export type ContactPerson = yup.InferType<typeof contactPersonSchema>;
