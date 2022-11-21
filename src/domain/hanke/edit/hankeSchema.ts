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
} from '../../types/hanke';
import { FORMFIELD } from './types';

// https://github.com/jquense/yup/issues/176
// https://github.com/jquense/yup/issues/952
export const contactSchema = yup.object().shape({
  etunimi: yup.string().nullable().max(100),
  sukunimi: yup.string().nullable().max(100),
  email: yup.string().email().nullable().max(100),
  puhelinnumero: yup.string().nullable().max(20),
  organisaatioId: yup.number().nullable(),
  organisaatioNimi: yup.string().nullable(),
  osasto: yup.string().nullable().max(200),
});

export const requiredContactSchema = yup.object().shape({
  etunimi: yup.string().required().max(100),
  sukunimi: yup.string().required(),
  email: yup.string().email().required().max(100),
  puhelinnumero: yup.string().required().max(20),
  organisaatioId: yup.number().nullable(),
  organisaatioNimi: yup.string().nullable(),
  osasto: yup.string().nullable().max(200),
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
  [FORMFIELD.ALKU_PVM]: yup.date().nullable().required(),
  [FORMFIELD.LOPPU_PVM]: yup
    .date()
    .nullable()
    .required()
    .when(
      FORMFIELD.ALKU_PVM,
      // eslint-disable-next-line
      // @ts-ignore nullable doesnt work with TS
      (alkuPvm: Date, schema: yup.DateSchema) => {
        try {
          return alkuPvm ? schema.min(alkuPvm) : schema;
        } catch (error) {
          return schema;
        }
      }
    ),
  [FORMFIELD.VAIHE]: yup.mixed().oneOf($enum(HANKE_VAIHE).getValues()).required(),
  [FORMFIELD.SUUNNITTELUVAIHE]: yup
    .mixed()
    .nullable()
    .when([FORMFIELD.VAIHE], {
      is: HANKE_VAIHE.SUUNNITTELU,
      then: yup.mixed().oneOf($enum(HANKE_SUUNNITTELUVAIHE).getValues()),
    }),
  [FORMFIELD.SUUNNITTELUVAIHE]: yup.string().nullable().when([FORMFIELD.VAIHE], {
    is: 'SUUNNITTELU',
    then: yup.string().required(),
  }),
  [FORMFIELD.OMISTAJAT]: yup
    .array()
    .nullable()
    // eslint-disable-next-line
    .when('$currentFormPage', (val: number, schema: any) =>
      val === 2 ? schema.ensure().of(requiredContactSchema) : schema
    ),
  [FORMFIELD.ARVIOIJAT]: yup.array().nullable().ensure().of(contactSchema),
  [FORMFIELD.TOTEUTTAJAT]: yup.array().nullable().ensure().of(contactSchema),
  [FORMFIELD.HANKEALUEET]: yup.array().ensure().of(hankeAlueSchema),
});
