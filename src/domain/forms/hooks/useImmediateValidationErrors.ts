import { useEffect, useState } from 'react';
import { AnyObject, ObjectSchema, ValidationError } from 'yup';
import { uniqBy } from 'lodash';

/**
 * Validates input data immediately and returns validation errors if validation fails.
 * Unlike useValidationErrors, this hook runs validation on initial mount.
 * This is useful for showing validation errors in view mode for draft items.
 */
export function useImmediateValidationErrors<T>(
  schema: ObjectSchema<AnyObject>,
  data: T,
  context?: AnyObject,
) {
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  useEffect(() => {
    schema
      .validate(data, { abortEarly: false, context })
      .then(() => {
        setValidationErrors([]);
      })
      .catch((error: ValidationError) => {
        setValidationErrors(uniqBy(error.inner, 'path'));
      });
  }, [schema, data, context]);

  return validationErrors;
}
