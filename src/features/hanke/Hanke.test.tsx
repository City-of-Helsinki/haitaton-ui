import React from 'react';
import { render, waitForElementToBeRemoved } from '@testing-library/react';
import Hanke from './Hanke';

test('renders learn react link', async () => {
  const { getByText } = render(<Hanke />);

  await waitForElementToBeRemoved(() => getByText('Ladataan...'));

  const linkElement = getByText(/haitaton-123/i);
  expect(linkElement).toBeInTheDocument();
});
