import { $enum } from 'ts-enum-util';
import yup from '../../../common/utils/yup';
import {
  HANKE_VAIHE,
  HANKE_SUUNNITTELUVAIHE,
  HANKE_MELUHAITTA,
  HANKE_POLYHAITTA,
  HANKE_TARINAHAITTA,
  HANKE_KAISTAHAITTA,
  HANKE_KAISTAPITUUSHAITTA,
  CONTACT_TYYPPI,
} from '../../types/hanke';
import { FORMFIELD } from './types';

const subContactSchema = yup
  .object()
  .nullable()
  .default(null)
  .shape({
    nimi: yup.string().max(100).required(),
    osoite: yup.string(),
    postiNro: yup.string(),
    postiTmPaikka: yup.string(),
    email: yup.string().email().max(100).required(),
    puhelinnumero: yup.string().nullable().default(null).max(20),
  });

const ownerSchema = subContactSchema.shape({
  tyyppi: yup.string().oneOf($enum(CONTACT_TYYPPI).getValues()).required(),
  tunnus: yup.string().required(),
  subContact: subContactSchema,
});

const contactSchema = ownerSchema.shape({
  subContacts: yup.array().ensure().of(subContactSchema),
});

const otherPartySchema = contactSchema
  .omit(['tyyppi', 'yTunnus', 'osoite', 'postiNro', 'postiTmPaikka'])
  .shape({
    rooli: yup.string().required(),
    organisaatio: yup.string(),
    osasto: yup.string(),
  });

export const hankeAlueSchema = yup.object().shape({
  [FORMFIELD.HAITTA_ALKU_PVM]: yup.date().required(),
  [FORMFIELD.HAITTA_LOPPU_PVM]: yup
    .date()
    .required()
    .when(FORMFIELD.HAITTA_ALKU_PVM, (alkuPvm: Date, schema: yup.DateSchema) => {
      try {
        return alkuPvm ? schema.min(alkuPvm) : schema;
      } catch (error) {
        return schema;
      }
    }),
  [FORMFIELD.MELUHAITTA]: yup.mixed().oneOf($enum(HANKE_MELUHAITTA).getValues()).required(),
  [FORMFIELD.POLYHAITTA]: yup.mixed().oneOf($enum(HANKE_POLYHAITTA).getValues()).required(),
  [FORMFIELD.TARINAHAITTA]: yup.mixed().oneOf($enum(HANKE_TARINAHAITTA).getValues()).required(),
  [FORMFIELD.KAISTAHAITTA]: yup.mixed().oneOf($enum(HANKE_KAISTAHAITTA).getValues()).required(),
  [FORMFIELD.KAISTAPITUUSHAITTA]: yup
    .mixed()
    .oneOf($enum(HANKE_KAISTAPITUUSHAITTA).getValues())
    .required(),
});

export const hankeSchema = yup.object().shape({
  [FORMFIELD.NIMI]: yup.string().min(3).required(),
  [FORMFIELD.KUVAUS]: yup.string().required().min(1),
  [FORMFIELD.KATUOSOITE]: yup.string().required(),
  [FORMFIELD.VAIHE]: yup.mixed().oneOf($enum(HANKE_VAIHE).getValues()).required(),
  [FORMFIELD.SUUNNITTELUVAIHE]: yup
    .mixed()
    .nullable()
    .when([FORMFIELD.VAIHE], {
      is: HANKE_VAIHE.SUUNNITTELU,
      then: yup.mixed().oneOf($enum(HANKE_SUUNNITTELUVAIHE).getValues()).required(),
    }),
  [FORMFIELD.HANKEALUEET]: yup.array().ensure().of(hankeAlueSchema),
  [FORMFIELD.OMISTAJAT]: yup.array().ensure().of(ownerSchema),
  [FORMFIELD.RAKENNUTTAJAT]: yup.array().ensure().of(contactSchema),
  [FORMFIELD.TOTEUTTAJAT]: yup.array().ensure().of(contactSchema),
  [FORMFIELD.MUUTTAHOT]: yup.array().ensure().of(otherPartySchema),
});
