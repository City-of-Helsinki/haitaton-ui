import startOfDay from 'date-fns/startOfDay';
import { $enum } from 'ts-enum-util';
import yup from '../../../common/utils/yup';
import { FORMFIELD, HANKE_VAIHE, HANKE_SUUNNITTELUVAIHE } from './types';

export const today = startOfDay(new Date());

export const isRequiredByFormPage = (formPage: number) => (val: number, schema: yup.MixedSchema) =>
  val === formPage ? schema.required() : schema;

export const hankeSchema = yup.object().shape({
  [FORMFIELD.NIMI]: yup.string().required().min(3),
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
  [FORMFIELD.KATUOSOITE]: yup.string().nullable().when('$formPage', isRequiredByFormPage(3)),
});
