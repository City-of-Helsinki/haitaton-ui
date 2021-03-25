import { t } from '../../locales/i18nForTests';
import { getInputErrorText } from './form';

describe('form:utils:getInputErrorText', () => {
  test('it returns correct key ', () => {
    const key = getInputErrorText(t, { foo: { message: { key: 'bar', values: {} } } }, 'foo');
    expect(key).toEqual('validations.bar');
  });

  test('it returns "default" translation when key exists but message is not correctly formatted', () => {
    const key = getInputErrorText(
      t,
      { foo: { message: 'This is like YUP default message' } },
      'foo'
    );
    expect(key).toEqual('Kentän arvo on virheellinen');
  });

  test('it returns undefined when key not found', () => {
    const key = getInputErrorText(
      t,
      { shouldNotFound: { message: { key: 'bar', values: {} } } },
      'foo'
    );
    expect(key).toEqual(undefined);
  });

  test('it return undefined when errors is null', () => {
    const key = getInputErrorText(t, null, 'foo');
    expect(key).toEqual(undefined);
  });
});
