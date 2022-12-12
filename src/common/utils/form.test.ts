import { t } from '../../locales/i18nForTests';
import { getInputErrorText } from './form';

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
