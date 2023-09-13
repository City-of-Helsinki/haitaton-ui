import { FieldErrors } from 'react-hook-form';
import { Feature } from 'ol';
import Geometry from 'ol/geom/Geometry';
import { PartialExcept } from '../../../common/types/utils';
import { HankeData, HankeContactTypeKey, HankeAlue } from '../../types/hanke';

export type FormNotification = 'ok' | 'success' | 'error' | null;

export enum FORMFIELD {
  TUNNUS = 'hankeTunnus',
  VAIHE = 'vaihe',
  NIMI = 'nimi',
  KUVAUS = 'kuvaus',
  KATUOSOITE = 'tyomaaKatuosoite',
  SUUNNITTELUVAIHE = 'suunnitteluVaihe',
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
  TUNNUS = 'ytunnusTaiHetu',
  OSOITE = 'osoite',
  POSTINRO = 'postinumero',
  POSTITOIMIPAIKKA = 'postitoimipaikka',
  EMAIL = 'email',
  PUHELINNUMERO = 'puhelinnumero',
  ORGANISAATIO = 'organisaatioNimi',
  OSASTO = 'osasto',
  ALIKONTAKTIT = 'alikontaktit',
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
