import React from 'react';
import { cleanup, getByTestId, fireEvent } from '@testing-library/react';
import Header from './Header';
import { render } from '../../../testUtils/render';

afterEach(cleanup);

describe('Header', () => {
  test('it should have Finnish as default language', () => {
    const { container } = render(<Header />);
    expect(getByTestId(container, 'homeLink')).toBeDefined();
    expect(getByTestId(container, 'homeLink')).toHaveTextContent('Alkuun');
    expect(getByTestId(container, 'hankeLink')).toBeDefined();
    expect(getByTestId(container, 'hankeLink')).toHaveTextContent('Luo uusi hanke');
  });
  test('it should change localization correctly to english', () => {
    const { container, getAllByText } = render(<Header />);

    fireEvent.click(getAllByText('Suomi')[0]);

    fireEvent.click(getAllByText('English')[0]);

    expect(getByTestId(container, 'homeLink')).toHaveTextContent('EN::Alkuun');
  });
});
