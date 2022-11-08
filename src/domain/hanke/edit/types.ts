import { FieldErrors } from 'react-hook-form';
import { PartialExcept } from '../../../common/types/utils';
import { HankeData, HankeContactTypeKey, HankeGeometria } from '../../types/hanke';

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
  OMISTAJA = 'omistaja',
  RAKENNUTTAJAT = 'rakennuttajat',
  TOTEUTTAJAT = 'toteuttajat',
  MUUTTAHOT = 'muutTahot',
  YKT_HANKE = 'onYKTHanke',
  GEOMETRIES_CHANGED = 'geometriesChanged',
  GEOMETRIAT = 'geometriat',
}

export enum CONTACT_FORMFIELD {
  ID = 'id',
  TYYPPI = 'tyyppi',
  ROOLI = 'rooli',
  NIMI = 'nimi',
  TUNNUS = 'tunnus',
  OSOITE = 'osoite',
  POSTINRO = 'postiNro',
  POSTITOIMIPAIKKA = 'postiToimiPaikka',
  EMAIL = 'email',
  PUHELINNUMERO = 'puhelinnumero',
  ORGANISAATIO = 'organisaatio',
  OSASTO = 'osasto',
}
export interface HankeDataFormState extends PartialExcept<HankeData, HankeContactTypeKey> {
  geometriesChanged?: boolean; // "virtualField"
  geometriat?: HankeGeometria | null;
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
