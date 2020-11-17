import { cleanup } from '@testing-library/react';
import { combineObj } from './utils';

afterEach(cleanup);

describe('Form', () => {
  const obj1 = { YTKHanke: true };
  const obj2 = { hankeenVaihe: '', omistajaOrganisaatio: '' };
  const result = {
    YTKHanke: true,
    hankeId: '',
    hankeenVaihe: '',
    name: '',
    omistajaOrganisaatio: '',
    owner: '',
    phase: 1,
  };
  test('Combain Objects', () => {
    expect(combineObj(obj1, obj2)).toEqual(result);
  });
});
