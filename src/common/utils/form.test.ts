import { t } from '../../locales/i18nForTests';
import { getInputErrorText } from './form';
import yup from './yup';

describe('form:utils:getInputErrorText', () => {
  test('it returns correct key ', () => {
    const key = getInputErrorText(t, {
      message: { key: 'bar', values: {} },
      ref: { name: 'foo' },
    });
    expect(key).toEqual('validations.bar');
  });

  test('it returns "default" translation when key exists but message is not correctly formatted', () => {
    const key = getInputErrorText(t, {
      message: 'This is like YUP default message',
      ref: { name: 'foo' },
    });
    expect(key).toEqual('Kentän arvo on virheellinen');
  });

  test('it return undefined when error is undefined', () => {
    const key = getInputErrorText(t, undefined);
    expect(key).toEqual(undefined);
  });
});

describe('phone number validation', () => {
  test('it should return error message when phone number is invalid', () => {
    expect(yup.string().phone().isValidSync('123kj456')).toEqual(false);
    expect(yup.string().phone().isValidSync('++1234567')).toEqual(false);
    expect(yup.string().phone().isValidSync('+1234567f')).toEqual(false);
  });

  test('it should return true when phone number is valid', () => {
    expect(yup.string().phone().isValidSync('0401234567')).toEqual(true);
    expect(yup.string().phone().isValidSync('+358401234567')).toEqual(true);
  });
});
