import { FormatFunction } from 'i18next';
import { parse, isDate } from 'date-fns';

export const parseDateString = (_: unknown, originalValue: string) =>
  isDate(originalValue) ? originalValue : parse(originalValue, 'yyyy-MM-dd', new Date());

// eslint-disable-next-line
const isI18nYupMessage = (errors: any, name: string): boolean => {
  if (errors && errors[name] && !!errors[name].message?.key && !!errors[name].message?.values) {
    return true;
  }

  // Warn if YUP message is not correct
  if (process.env.NODE_ENV === 'development' && errors && errors[name]) {
    // eslint-disable-next-line
    console.warn(
      `YUP translation key is not setup correctly. Fieldname: '${name}'. Message: `,
      errors[name]
    );
  }
  return false;
};

export const getInputErrorText = (
  t: FormatFunction,
  // eslint-disable-next-line
  errors: any,
  name: string
): string | undefined => {
  if (isI18nYupMessage(errors, name)) {
    return t(`form:validations:${errors[name].message.key}`, errors[name].message.values);
  }

  if (errors && errors[name] && errors[name].message) {
    return t(`form:validations:default`);
  }

  return undefined;
};
