import yup from '../../../common/utils/yup';
import { FORMFIELD } from './types';

export const today = new Date();

export const isRequiredByFormPage = (formPage: number) => (val: number, schema: yup.MixedSchema) =>
  val === formPage ? schema.required() : schema;

export const hankeSchema = yup.object().shape({
  [FORMFIELD.NIMI]: yup.string().required().min(3),
  [FORMFIELD.KUVAUS]: yup.string().required().min(1),
  [FORMFIELD.ALKU_PVM]: yup.date().required().min(today),
  [FORMFIELD.LOPPU_PVM]: yup
    .date()
    .required()
    .when(FORMFIELD.ALKU_PVM, (alkuPvm: Date, schema: yup.DateSchema) =>
      alkuPvm ? schema.min(new Date(alkuPvm)) : schema
    ),
  [FORMFIELD.KATUOSOITE]: yup.string().nullable().when('$formPage', isRequiredByFormPage(3)),
});
