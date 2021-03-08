import React from 'react';
import { cleanup } from '@testing-library/react';
import HankeIndexes from './HankeIndexes';
import { render } from '../../../../testUtils/render';
import hankeList from '../../../mocks/hankeList';

afterEach(cleanup);

describe('HankeSidebar', () => {
  test('Should be display data correctly', async () => {
    const { findByText, getByTestId } = render(
      <HankeIndexes hankeTunnus={hankeList[0].hankeTunnus} />
    );
    expect(findByText('Liikennehaittaindeksi')).toBeTruthy();
    expect(getByTestId('sidebar-liikennehaittaindeksi')).toHaveTextContent('4');
  });
});
