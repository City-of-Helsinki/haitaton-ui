import { cleanup } from '@testing-library/react';
import { combineObj } from './utils';
import { HANKE_VAIHE } from './types';

afterEach(cleanup);

describe('Form', () => {
  const obj1 = { YKTHanke: true };
  const obj2 = { vaihe: HANKE_VAIHE.OHJELMOINTI, omistajaOrganisaatio: '' };
  const result = {
    YKTHanke: true,
    hankeId: '',
    vaihe: HANKE_VAIHE.OHJELMOINTI,
    nimi: '',
    omistajaOrganisaatio: '',
  };
  test('Combain Objects', () => {
    expect(combineObj(obj1, obj2)).toEqual(result);
  });
});
