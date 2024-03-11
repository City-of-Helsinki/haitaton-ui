import { useEffect, useRef, useState } from 'react';
import { AnyObject, ObjectSchema, ValidationError } from 'yup';
import { isEqual } from 'lodash';

/**
 * Validates input data and returns validation errors if validation fails
 */
export function useValidationErrors<T>(schema: ObjectSchema<AnyObject>, data: T) {
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!isEqual(ref.current, data)) {
      ref.current = data;
      schema
        .validate(data, { abortEarly: false })
        .then(() => {
          setValidationErrors([]);
        })
        .catch((error: ValidationError) => {
          setValidationErrors(error.inner);
        });
    }
  }, [schema, data]);

  return validationErrors;
}
