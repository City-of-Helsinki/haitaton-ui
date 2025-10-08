import { useEffect, useRef, useState } from 'react';
import { AnyObject, ObjectSchema, ValidationError } from 'yup';
import { cloneDeep, isEqual, uniqBy } from 'lodash';

/**
 * Validates input data and returns validation errors if validation fails
 */
export function useValidationErrors<T>(
  schema: ObjectSchema<AnyObject>,
  data: T,
  context?: AnyObject,
) {
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const ref = useRef<T | null>(null);
  useEffect(() => {
    // On initial mount we seed the ref with the current data but do not run
    // validation. This prevents showing validation errors before the user
    // has had a chance to interact with the form (tests rely on that
    // behaviour).
    if (ref.current === null) {
      ref.current = cloneDeep(data);
      return;
    }

    if (!isEqual(ref.current, data)) {
      ref.current = cloneDeep(data);
      schema
        .validate(data, { abortEarly: false, context })
        .then(() => {
          setValidationErrors([]);
        })
        .catch((error: ValidationError) => {
          setValidationErrors(uniqBy(error.inner, 'path'));
        });
    }
  }, [schema, data, context]);
  return validationErrors;
}
