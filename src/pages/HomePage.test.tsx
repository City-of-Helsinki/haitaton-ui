import React from 'react';
import { waitFor } from '@testing-library/react';
import HomePage from './HomePage';
import { render } from '../testUtils/render';

describe('HomePage', () => {
  test('it should have correct document title', async () => {
    render(<HomePage />);
    await waitFor(() => expect(document.title).toEqual('Haitaton - Etusivu'));
  });
});
