import { $enum } from 'ts-enum-util';
import yup from '../../../common/utils/yup';
import {
  HANKE_VAIHE,
  HANKE_MELUHAITTA,
  HANKE_POLYHAITTA,
  HANKE_TARINAHAITTA,
  HANKE_KAISTAHAITTA,
  HANKE_KAISTAPITUUSHAITTA,
  CONTACT_TYYPPI,
} from '../../types/hanke';
import { FORMFIELD, CONTACT_FORMFIELD, SUBCONTACT_FORMFIELD } from './types';
import isValidBusinessId from '../../../common/utils/isValidBusinessId';

const subContactSchema = yup
  .object()
  .nullable()
  .default(null)
  .shape({
    [SUBCONTACT_FORMFIELD.SUKUNIMI]: yup.string().max(50),
    [SUBCONTACT_FORMFIELD.ETUNIMI]: yup.string().max(50),
    [SUBCONTACT_FORMFIELD.EMAIL]: yup.string().email().max(100),
    [SUBCONTACT_FORMFIELD.PUHELINNUMERO]: yup.string().nullable().default(null).max(20),
  });

const contactSchema = yup
  .object()
  .nullable()
  .default(null)
  .shape({
    [CONTACT_FORMFIELD.NIMI]: yup.string().max(100),
    [CONTACT_FORMFIELD.TYYPPI]: yup
      .mixed()
      .nullable()
      .oneOf([null, ...$enum(CONTACT_TYYPPI).getValues()])
      .notRequired(),
    [CONTACT_FORMFIELD.TUNNUS]: yup
      .string()
      .nullable()
      .when('tyyppi', {
        is: (value: string) => value === CONTACT_TYYPPI.YRITYS || value === CONTACT_TYYPPI.YHTEISO,
        then: (schema) =>
          schema.test('is-business-id', 'Is not valid business id', isValidBusinessId),
        otherwise: (schema) => schema,
      }),
    [CONTACT_FORMFIELD.EMAIL]: yup.string().email().max(100),
    [CONTACT_FORMFIELD.PUHELINNUMERO]: yup.string().nullable().default(null).max(20),
    [CONTACT_FORMFIELD.ALIKONTAKTIT]: yup.array().ensure().of(subContactSchema),
  });

const otherPartySchema = contactSchema
  .omit([CONTACT_FORMFIELD.TYYPPI, CONTACT_FORMFIELD.TUNNUS])
  .shape({
    [CONTACT_FORMFIELD.ROOLI]: yup.string(),
    [CONTACT_FORMFIELD.ORGANISAATIO]: yup.string(),
    [CONTACT_FORMFIELD.OSASTO]: yup.string(),
  });

export const hankeAlueSchema = yup.object().shape({
  [FORMFIELD.NIMI]: yup.string(),
  [FORMFIELD.HAITTA_ALKU_PVM]: yup.date(),
  [FORMFIELD.HAITTA_LOPPU_PVM]: yup
    .date()
    .when(FORMFIELD.HAITTA_ALKU_PVM, (alkuPvm: Date, schema: yup.DateSchema) => {
      try {
        return alkuPvm ? schema.min(alkuPvm) : schema;
      } catch (error) {
        return schema;
      }
    }),
  [FORMFIELD.MELUHAITTA]: yup.mixed().oneOf([...$enum(HANKE_MELUHAITTA).getValues(), null]),
  [FORMFIELD.POLYHAITTA]: yup.mixed().oneOf([...$enum(HANKE_POLYHAITTA).getValues(), null]),
  [FORMFIELD.TARINAHAITTA]: yup.mixed().oneOf([...$enum(HANKE_TARINAHAITTA).getValues(), null]),
  [FORMFIELD.KAISTAHAITTA]: yup.mixed().oneOf([...$enum(HANKE_KAISTAHAITTA).getValues(), null]),
  [FORMFIELD.KAISTAPITUUSHAITTA]: yup
    .mixed()
    .oneOf([...$enum(HANKE_KAISTAPITUUSHAITTA).getValues(), null]),
});

export const hankeSchema = yup.object().shape({
  hankeTunnus: yup.string().required(),
  [FORMFIELD.NIMI]: yup.string().min(3).required(),
  [FORMFIELD.KUVAUS]: yup.string(),
  [FORMFIELD.KATUOSOITE]: yup.string(),
  [FORMFIELD.VAIHE]: yup.mixed().oneOf([...$enum(HANKE_VAIHE).getValues(), null]),
  [FORMFIELD.HANKEALUEET]: yup.array().ensure().of(hankeAlueSchema),
  [FORMFIELD.OMISTAJAT]: yup.array().length(1).ensure().of(contactSchema),
  [FORMFIELD.RAKENNUTTAJAT]: yup.array().ensure().of(contactSchema),
  [FORMFIELD.TOTEUTTAJAT]: yup.array().ensure().of(contactSchema),
  [FORMFIELD.MUUTTAHOT]: yup.array().ensure().of(otherPartySchema),
});
