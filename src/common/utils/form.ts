/* eslint-disable @typescript-eslint/no-explicit-any */
import { TFunction } from 'i18next';
import { parse, isDate } from 'date-fns';

export const parseDateString = (_: unknown, originalValue: string) =>
  isDate(originalValue) ? originalValue : parse(originalValue, 'yyyy-MM-dd', new Date());

const isI18nYupMessage = (error: any): boolean => {
  if (error && !!error.message?.key && !!error.message?.values) {
    return true;
  }

  // Warn if YUP message is not correct
  if (process.env.NODE_ENV === 'development' && error && error.ref) {
    console.warn(
      `YUP translation key is not setup correctly. Fieldname: '${error.ref.name}'. Message: `,
      error,
    );
  }
  return false;
};

export const getInputErrorText = (
  t: TFunction<string>,

  error: any,
): string | undefined => {
  if (isI18nYupMessage(error)) {
    return t(`form:validations:${error.message.key}`, error.message.values) as string;
  }

  if (error && error.message) {
    return t(`form:validations:default`);
  }

  return undefined;
};
