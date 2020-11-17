import { cleanup } from '@testing-library/react';
import { combineObj } from './utils';

afterEach(cleanup);

describe('Form', () => {
  const obj1 = { YTKHanke: true };
  const obj2 = { hankeenVaihe: '', omistajaOrganisaatio: '' };
  const result = { hankeId: '', name: '', owner: '', phase: 1, YTKHanke: true };
  test('adds 1 + 2 to equal 3', () => {
    expect(combineObj(obj1, obj2)).toEqual(result);
  });
});
