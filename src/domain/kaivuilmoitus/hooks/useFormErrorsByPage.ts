import { AnyObject } from 'yup';
import { useValidationErrors } from '../../forms/hooks/useValidationErrors';
import {
  alueetSchema,
  haittojenhallintaSuunnitelmaSchema,
  perustiedotSchema,
  yhteystiedotSchema,
} from '../validationSchema';

export function useFormErrorsByPage<T>(formData: T, context: AnyObject) {
  const perustiedotErrors = useValidationErrors(perustiedotSchema, formData);
  const alueetErrors = useValidationErrors(alueetSchema, formData);
  const haittojenhallintaErrors = useValidationErrors(
    haittojenhallintaSuunnitelmaSchema,
    formData,
    context,
  );
  const yhteystiedotErrors = useValidationErrors(yhteystiedotSchema, formData);
  const formErrorsByPage = [
    perustiedotErrors,
    alueetErrors,
    haittojenhallintaErrors,
    yhteystiedotErrors,
    [],
    [],
  ];

  return formErrorsByPage;
}
