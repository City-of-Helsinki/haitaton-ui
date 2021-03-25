import React from 'react';
import { cleanup } from '@testing-library/react';
import HankeSidebar from './HankeSidebar';
import { render } from '../../../../testUtils/render';
import hankeList from '../../../mocks/hankeList';

afterEach(cleanup);

describe('HankeSidebar', () => {
  test('Should be display data correctly', async () => {
    const { findByText } = render(
      <HankeSidebar hanke={hankeList[0]} isOpen handleClose={() => ({})} />
    );
    expect(findByText('Mannerheimintie autottomaksi')).toBeTruthy();
    expect(findByText('26.11.2020')).toBeTruthy();
    expect(findByText('17.11.2020')).toBeTruthy();
    expect(findByText('Objelmointi')).toBeTruthy();
    expect(findByText('Sadevesi, Viemäri')).toBeTruthy();
    expect(findByText('Hankkeen kuvaus')).toBeTruthy();
  });
});
