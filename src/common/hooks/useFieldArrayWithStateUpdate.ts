import { useEffect } from 'react';
import {
  FieldValues,
  FieldArrayPath,
  UseFieldArrayProps,
  useFieldArray,
  useFormContext,
} from 'react-hook-form';

/**
 * Wrapper for React Hook Form useFieldArray that calls
 * setValue for each field in fieldArray when the fields
 * change, so that the fields are updated correctly
 */
export default function useFieldArrayWithStateUpdate<
  TFieldValues extends FieldValues,
  TFieldArrayName extends FieldArrayPath<TFieldValues>,
>(props: UseFieldArrayProps<TFieldValues, TFieldArrayName>) {
  const { setValue, getValues } = useFormContext();
  const fieldArrayReturn = useFieldArray<TFieldValues, TFieldArrayName>(props);

  useEffect(() => {
    fieldArrayReturn.fields.forEach((_, index) => {
      setValue(`${props.name}.${index}`, getValues(`${props.name}.${index}`));
    });
  }, [setValue, getValues, fieldArrayReturn.fields, props.name]);

  return fieldArrayReturn;
}
