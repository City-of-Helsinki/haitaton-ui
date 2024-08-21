import { useEffect, useRef, useState } from 'react';
import { AnyObject, ObjectSchema, ValidationError } from 'yup';
import { cloneDeep, isEqual, uniqBy } from 'lodash';

/**
 * Validates input data and returns validation errors if validation fails
 */
export function useValidationErrors<T>(schema: ObjectSchema<AnyObject>, data: T) {
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const ref = useRef<T | null>(null);
  useEffect(() => {
    if (!isEqual(ref.current, data)) {
      ref.current = cloneDeep(data);
      schema
        .validate(data, { abortEarly: false, context: { hanke: data } })
        .then(() => {
          setValidationErrors([]);
        })
        .catch((error: ValidationError) => {
          setValidationErrors(uniqBy(error.inner, 'path'));
        });
    }
  }, [schema, data]);
  return validationErrors;
}
