import { useEffect } from 'react';
import { useFieldArray, UseFieldArrayProps, useFormContext } from 'react-hook-form';

/**
 * Wrapper for React Hook Form useFieldArray that calls
 * setValue for each field in fieldArray when the fields
 * change, so that the fields are updated correctly
 */
export default function useFieldArrayWithStateUpdate(props: UseFieldArrayProps) {
  const { setValue, getValues } = useFormContext();
  const fieldArrayReturn = useFieldArray(props);

  useEffect(() => {
    fieldArrayReturn.fields.forEach((_, index) => {
      setValue(`${props.name}.${index}`, getValues(`${props.name}.${index}`));
    });
  }, [setValue, getValues, fieldArrayReturn.fields, props.name]);

  return fieldArrayReturn;
}
