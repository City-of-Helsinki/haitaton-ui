import startOfDay from 'date-fns/startOfDay';
import endOfDay from 'date-fns/endOfDay';
import { $enum } from 'ts-enum-util';
import yup from '../../../common/utils/yup';
import { HANKE_VAIHE, HANKE_SUUNNITTELUVAIHE } from '../../types/hanke';
import { FORMFIELD } from './types';

export const today = startOfDay(new Date());

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
  [FORMFIELD.HAITTA_ALKU_PVM]: yup
    .date()
    .nullable()
    .when(
      ['$currentFormPage', FORMFIELD.ALKU_PVM, FORMFIELD.LOPPU_PVM],
      // eslint-disable-next-line
      // @ts-ignore nullable doesnt work with TS
      (currentFormPage: number, alkuPvm: Date, loppuPvm: Date, schema: yup.DateSchema) => {
        if (currentFormPage !== 4) return schema;
        return alkuPvm
          ? schema.min(startOfDay(new Date(alkuPvm))).max(endOfDay(new Date(loppuPvm)))
          : schema;
      }
    ),
  [FORMFIELD.HAITTA_LOPPU_PVM]: yup
    .date()
    .nullable()
    .when(
      ['$currentFormPage', FORMFIELD.ALKU_PVM, FORMFIELD.LOPPU_PVM],
      // eslint-disable-next-line
      // @ts-ignore nullable doesnt work with TS
      (currentFormPage: number, alkuPvm: Date, loppuPvm: Date, schema: yup.DateSchema) => {
        if (currentFormPage !== 4) return schema;
        return loppuPvm
          ? schema.min(startOfDay(new Date(alkuPvm))).max(endOfDay(new Date(loppuPvm)))
          : schema;
      }
    ),
});
