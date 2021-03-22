import React from 'react';
import { cleanup, getByTestId } from '@testing-library/react';
import Header from './Header';
import { render } from '../../../testUtils/render';

afterEach(cleanup);

describe('Header', () => {
  test('it should have Finnish as default language', () => {
    const { container } = render(<Header />);
    expect(getByTestId(container, 'hankeLink')).toBeDefined();
    expect(getByTestId(container, 'hankeLink')).toHaveTextContent('Luo uusi hanke');
  });
});
