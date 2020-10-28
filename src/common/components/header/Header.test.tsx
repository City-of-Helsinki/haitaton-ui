import React from 'react';
import { cleanup, getByTestId, fireEvent } from '@testing-library/react';
import Header from './Header';
import { render } from '../../../testUtils/render';

afterEach(cleanup);

describe('Header', () => {
  test('it should have Finnish as default language', () => {
    const { container } = render(<Header />);
    expect(getByTestId(container, 'home-link')).toBeDefined();
    expect(getByTestId(container, 'home-link')).toHaveTextContent('Alkuun');
    expect(getByTestId(container, 'hankeLink')).toBeDefined();
    expect(getByTestId(container, 'hankeLink')).toHaveTextContent('Luo uusi hanke');
  });
  test('it should change localization correctly to english', () => {
    const { container, getByText } = render(<Header />);

    fireEvent.click(getByText('Suomi'));
    fireEvent.click(getByText('English'));

    expect(getByTestId(container, 'home-link')).toHaveTextContent('EN::Alkuun');
  });
});
