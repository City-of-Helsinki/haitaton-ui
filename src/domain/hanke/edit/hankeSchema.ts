import startOfDay from 'date-fns/startOfDay';
import { $enum } from 'ts-enum-util';
import yup from '../../../common/utils/yup';
import { FORMFIELD, HANKE_VAIHE, HANKE_SUUNNITTELUVAIHE } from '../../types/hanke';

export const today = startOfDay(new Date());

export const isRequiredByFormPage = (formPage: number) => (val: number, schema: yup.MixedSchema) =>
  val === formPage ? schema.required() : schema;

export const contactSchema = yup.object().shape({
  sukunimi: yup.string().nullable().max(100),
  etunimi: yup.string().nullable().max(100),
  email: yup.string().email().nullable().max(100),
  puhelinnumero: yup.string().nullable().max(20),
  organisaatioId: yup.number().nullable(),
  organisaatioNimi: yup.string().nullable(),
  osasto: yup.string().nullable().max(200),
});

export const hankeSchema = yup.object().shape({
  [FORMFIELD.NIMI]: yup.string().min(3).required(),
  [FORMFIELD.KUVAUS]: yup.string().required().min(1),
  [FORMFIELD.ALKU_PVM]: yup.date().nullable().required().min(today),
  [FORMFIELD.LOPPU_PVM]: yup
    .date()
    .nullable()
    .required()
    .when(
      FORMFIELD.ALKU_PVM,
      // eslint-disable-next-line
      // @ts-ignore nullable doesnt work with TS
      (alkuPvm: Date, schema: yup.DateSchema) => (alkuPvm ? schema.min(new Date(alkuPvm)) : schema)
    ),
  [FORMFIELD.VAIHE]: yup.mixed().oneOf($enum(HANKE_VAIHE).getValues()),
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
  [FORMFIELD.KATUOSOITE]: yup.string().nullable().when('$formPage', isRequiredByFormPage(3)),
  [FORMFIELD.KATUOSOITE]: yup.string().nullable().when('$formPage', isRequiredByFormPage(3)),
  [FORMFIELD.OMISTAJAT]: yup.array().nullable().ensure().of(contactSchema),
  [FORMFIELD.ARVIOIJAT]: yup.array().nullable().ensure().of(contactSchema),
  [FORMFIELD.TOTEUTTAJAT]: yup.array().nullable().ensure().of(contactSchema),
});
