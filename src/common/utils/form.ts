import { FormatFunction } from 'i18next';

// eslint-disable-next-line
const isI18nYupMessage = (errors: any, name: string): boolean => {
  if (
    typeof errors === 'object' &&
    errors[name] &&
    !!errors[name].message?.key &&
    !!errors[name].message?.values
  ) {
    return true;
  }

  // eslint-disable-next-line
  console.warn(
    `YUP translation key is not setup correctly. Fieldname: '${name}'. Message: `,
    errors[name]
  );
  return false;
};

export const getInputErrorText = (
  t: FormatFunction,
  // eslint-disable-next-line
  errors: any,
  name: string
): string | undefined => {
  // Show translated message
  if (isI18nYupMessage(errors, name)) {
    return t(`form:validations:${errors[name].message.key}`, errors[name].message.values);
  }

  // Show YUP default message (english)
  if (errors[name] && errors[name].message) {
    return t(`form:validations:default`);
  }

  // Dont show anything
  return undefined;
};
