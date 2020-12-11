import yup from '../../../common/utils/yup';
import { FORMFIELD } from './types';

const isRequiredByFormPage = (formPage: number) => (val: number, schema: yup.MixedSchema) =>
  val === formPage ? schema.required() : schema;

export const hankeSchema = yup.object().shape({
  [FORMFIELD.NIMI]: yup.string().required().min(3),
  [FORMFIELD.ALKU_PVM]: yup.string().required(),
  [FORMFIELD.LOPPU_PVM]: yup.string().required(),
  [FORMFIELD.KATUOSOITE]: yup.string().nullable().when('$formPage', isRequiredByFormPage(3)),
});
