import React from 'react';
import { cleanup } from '@testing-library/react';
import HankeIndexes from './HankeIndexes';
import { render } from '../../../../testUtils/render';
import hankeIndexData from '../../../mocks/hankeIndexData';

afterEach(cleanup);

describe('HankeSidebar', () => {
  test('Should be display data correctly', async () => {
    const { findByText, getByTestId } = render(<HankeIndexes hankeIndexData={hankeIndexData} />);
    expect(findByText('Liikennehaittaindeksi')).toBeTruthy();
    expect(getByTestId('test-liikennehaittaIndeksi')).toHaveTextContent('4');
    expect(findByText('Pyöräilyn pääreitti')).toBeTruthy();
    expect(getByTestId('test-pyorailyIndeksi')).toHaveTextContent('3');
    expect(findByText('Merkittävät joukkoliikennereitit')).toBeTruthy();
    expect(getByTestId('test-joukkoliikenneIndeksi')).toHaveTextContent('1');
  });
});
