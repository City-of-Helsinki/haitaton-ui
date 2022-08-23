/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormikTouched } from 'formik';
import { FormatFunction } from 'i18next';

export function getFormErrorText(
  t: FormatFunction,
  errors: any,
  touched: FormikTouched<any> | undefined,
  fieldName: string
) {
  if (touched?.[fieldName]) {
    if (errors?.[fieldName]?.key) {
      return t(`form:validations:${errors[fieldName].key}`, errors[fieldName].values);
    }
    if (errors?.[fieldName]) {
      return errors[fieldName];
    }
  }
  return undefined;
}
