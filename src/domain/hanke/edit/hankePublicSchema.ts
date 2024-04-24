import yup from '../../../common/utils/yup';
import isValidBusinessId from '../../../common/utils/isValidBusinessId';
import {
  CONTACT_TYYPPI,
  HANKE_KAISTAHAITTA_KEY,
  HANKE_KAISTAPITUUSHAITTA_KEY,
  HANKE_MELUHAITTA_KEY,
  HANKE_POLYHAITTA_KEY,
  HANKE_TARINAHAITTA_KEY,
  HANKE_VAIHE_KEY,
} from '../../types/hanke';
import { CONTACT_FORMFIELD, FORMFIELD } from './types';

enum ERROR_KEYS {
  REQUIRED = 'required',
  MIN = 'min',
}

enum HANKE_PAGES {
  PERUSTIEDOT = 'perustiedot',
  ALUEET = 'alueet',
  HAITTOJENHALLINTA = 'haittojenHallinta',
  YHTEYSTIEDOT = 'yhteystiedot',
}

export type Message = {
  key: string;
  values: {
    page: string;
  };
};

function getMessage(page: string, key: string = ERROR_KEYS.REQUIRED): Message {
  return { key, values: { page } };
}

const hankeAlueSchema = yup.object({
  [FORMFIELD.HAITTA_ALKU_PVM]: yup.date().required(getMessage(HANKE_PAGES.ALUEET)),
  [FORMFIELD.HAITTA_LOPPU_PVM]: yup.date().required(getMessage(HANKE_PAGES.ALUEET)),
  [FORMFIELD.MELUHAITTA]: yup
    .mixed<HANKE_MELUHAITTA_KEY>()
    .required(getMessage(HANKE_PAGES.ALUEET)),
  [FORMFIELD.POLYHAITTA]: yup
    .mixed<HANKE_POLYHAITTA_KEY>()
    .required(getMessage(HANKE_PAGES.ALUEET)),
  [FORMFIELD.TARINAHAITTA]: yup
    .mixed<HANKE_TARINAHAITTA_KEY>()
    .required(getMessage(HANKE_PAGES.ALUEET)),
  [FORMFIELD.KAISTAHAITTA]: yup
    .mixed<HANKE_KAISTAHAITTA_KEY>()
    .required(getMessage(HANKE_PAGES.ALUEET)),
  [FORMFIELD.KAISTAPITUUSHAITTA]: yup
    .mixed<HANKE_KAISTAPITUUSHAITTA_KEY>()
    .required(getMessage(HANKE_PAGES.ALUEET)),
});

const yhteystietoSchema = yup.object({
  [CONTACT_FORMFIELD.NIMI]: yup.string().required(getMessage(HANKE_PAGES.YHTEYSTIEDOT)),
  [CONTACT_FORMFIELD.EMAIL]: yup.string().email().required(getMessage(HANKE_PAGES.YHTEYSTIEDOT)),
  [CONTACT_FORMFIELD.TUNNUS]: yup
    .string()
    .nullable()
    .when('tyyppi', {
      is: (value: string) => value === CONTACT_TYYPPI.YRITYS || value === CONTACT_TYYPPI.YHTEISO,
      then: (schema) =>
        schema.test(
          'is-business-id',
          getMessage(CONTACT_FORMFIELD.TUNNUS, HANKE_PAGES.YHTEYSTIEDOT),
          isValidBusinessId,
        ),
      otherwise: (schema) => schema,
    }),
});

export const hankePublicSchema = yup.object({
  [FORMFIELD.NIMI]: yup.string().required(getMessage(HANKE_PAGES.PERUSTIEDOT)),
  [FORMFIELD.KUVAUS]: yup.string().required(getMessage(HANKE_PAGES.PERUSTIEDOT)),
  [FORMFIELD.KATUOSOITE]: yup.string().required(getMessage(HANKE_PAGES.PERUSTIEDOT)),
  [FORMFIELD.VAIHE]: yup.mixed<HANKE_VAIHE_KEY>().required(getMessage(HANKE_PAGES.PERUSTIEDOT)),
  [FORMFIELD.HANKEALUEET]: yup
    .array(hankeAlueSchema)
    .min(1, getMessage(HANKE_PAGES.ALUEET, ERROR_KEYS.MIN)),
  [FORMFIELD.OMISTAJAT]: yup
    .array(yhteystietoSchema)
    .min(1, getMessage(HANKE_PAGES.YHTEYSTIEDOT, ERROR_KEYS.MIN)),
  [FORMFIELD.RAKENNUTTAJAT]: yup.array(yhteystietoSchema),
  [FORMFIELD.TOTEUTTAJAT]: yup.array(yhteystietoSchema),
  [FORMFIELD.MUUTTAHOT]: yup.array(yhteystietoSchema.omit([CONTACT_FORMFIELD.TUNNUS])),
});

export const hankePerustiedotPublicSchema = hankePublicSchema.pick([
  FORMFIELD.NIMI,
  FORMFIELD.KUVAUS,
  FORMFIELD.KATUOSOITE,
  FORMFIELD.VAIHE,
]);

export const hankeAlueetPublicSchema = hankePublicSchema.pick([FORMFIELD.HANKEALUEET]);

export const hankeYhteystiedotPublicSchema = hankePublicSchema.pick([
  FORMFIELD.OMISTAJAT,
  FORMFIELD.RAKENNUTTAJAT,
  FORMFIELD.TOTEUTTAJAT,
  FORMFIELD.MUUTTAHOT,
]);
