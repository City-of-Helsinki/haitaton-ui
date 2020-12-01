import { cleanup } from '@testing-library/react';
import { combineObj } from './utils';
import { HANKE_VAIHE, FORMFIELD } from './types';

afterEach(cleanup);

describe('Form', () => {
  const obj1 = { [FORMFIELD.YKT_HANKE]: true, [FORMFIELD.TUNNUS]: '', [FORMFIELD.NIMI]: '' };
  const obj2 = { [FORMFIELD.VAIHE]: HANKE_VAIHE.OHJELMOINTI };
  const result = {
    [FORMFIELD.YKT_HANKE]: true,
    [FORMFIELD.TUNNUS]: '',
    [FORMFIELD.VAIHE]: HANKE_VAIHE.OHJELMOINTI,
    [FORMFIELD.NIMI]: '',
  };
  test('Combain Objects', () => {
    expect(combineObj(obj1, obj2)).toEqual(result);
  });
});
