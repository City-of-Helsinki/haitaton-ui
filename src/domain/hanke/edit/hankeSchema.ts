import { $enum } from 'ts-enum-util';
import yup from '../../../common/utils/yup';
import { HANKE_VAIHE, HANKE_SUUNNITTELUVAIHE } from '../../types/hanke';
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
  [FORMFIELD.OMISTAJAT]: yup
    .array()
    .nullable()
    // eslint-disable-next-line
    .when('$currentFormPage', (val: number, schema: any) =>
      val === 2 ? schema.ensure().of(requiredContactSchema) : schema
    ),
  [FORMFIELD.ARVIOIJAT]: yup.array().nullable().ensure().of(contactSchema),
  [FORMFIELD.TOTEUTTAJAT]: yup.array().nullable().ensure().of(contactSchema),
  [FORMFIELD.HAITTA_ALKU_PVM]: yup.date().nullable(),
  [FORMFIELD.HAITTA_LOPPU_PVM]: yup.date().nullable(),
});
