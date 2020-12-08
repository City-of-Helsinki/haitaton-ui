import { t } from '../../locales/i18nForTests';
import { getInputErrorText } from './form';

describe('form:utils:getInputErrorText', () => {
  test('it returns correct ', async () => {
    const val = getInputErrorText(t, { foo: { message: { key: 'bar', values: {} } } }, 'foo');

    console.log(val);

    expect(val).toBe('form:validations:bar');
  });
});
