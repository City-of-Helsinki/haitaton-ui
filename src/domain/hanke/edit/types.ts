import { FieldErrors, Control } from 'react-hook-form';
import { PartialExcept } from '../../../common/types/utils';
import { HankeData } from '../../types/hanke';

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

type DraftRequiredFields =
  | `${FORMFIELD.OMISTAJAT}`
  | `${FORMFIELD.TOTEUTTAJAT}`
  | `${FORMFIELD.ARVIOIJAT}`;

export interface HankeDataFormState extends PartialExcept<HankeData, DraftRequiredFields> {
  geometriesChanged?: boolean; // "virtualField"
}
export interface OrganizationStateObj {
  // eslint-disable-next-line
  checked: any;
  name: string;
}
export type OrganizationState = Array<OrganizationStateObj>;

export interface FormProps {
  formData: HankeDataFormState;
  errors: FieldErrors;
  control: Control;
  // eslint-disable-next-line
  register: any;
  // eslint-disable-next-line
  setOrganization?: (index: number, val: any) => void;

  // eslint-disable-next-line
  organizationState?: OrganizationState;
}
