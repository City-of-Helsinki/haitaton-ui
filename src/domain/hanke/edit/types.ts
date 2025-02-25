import { FieldErrors } from 'react-hook-form';
import { Feature } from 'ol';
import Geometry from 'ol/geom/Geometry';
import { PartialExcept } from '../../../common/types/utils';
import {
  HankeData,
  HankeContactTypeKey,
  HankeAlue,
  HankeYhteystieto,
  HankeMuuTaho,
} from '../../types/hanke';
import yup from '../../../common/utils/yup';
import { yhteyshenkiloSchema, newHankeSchema } from './hankeSchema';

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
  HAITTOJENHALLINTASUUNNITELMA = 'haittojenhallintasuunnitelma',
  YLEISTEN_HAITTOJEN_HALLINTASUUNNITELMA = 'yleistenHaittojenHallintasuunnitelma',
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
  YHTEYSHENKILOT = 'yhteyshenkilot',
}

export enum YHTEYSHENKILO_FORMFIELD {
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
  haittaIndexesIncreased?: boolean; // "virtualField"
  alueet?: HankeAlueFormState[];
}

export interface FormProps {
  hanke: HankeDataFormState;
  errors: FieldErrors;
  // eslint-disable-next-line
  register: any;
}

export interface HankePostYhteystieto extends Omit<HankeYhteystieto, 'yhteyshenkilot'> {
  yhteyshenkilot: string[];
}

export interface HankePostMuuTaho extends Omit<HankeMuuTaho, 'yhteyshenkilot'> {
  yhteyshenkilot: string[];
}

export interface HankePostData
  extends Omit<HankeDataFormState, 'omistajat' | 'rakennuttajat' | 'toteuttajat' | 'muut'> {
  omistajat: HankePostYhteystieto[];
  rakennuttajat: HankePostYhteystieto[];
  toteuttajat: HankePostYhteystieto[];
  muut: HankePostMuuTaho[];
}

export type NewHankeData = yup.InferType<typeof newHankeSchema>;

export type Yhteyshenkilo = yup.InferType<typeof yhteyshenkiloSchema>;
export type YhteyshenkiloWithoutName = Pick<
  Yhteyshenkilo,
  YHTEYSHENKILO_FORMFIELD.EMAIL | YHTEYSHENKILO_FORMFIELD.PUHELINNUMERO
>;
