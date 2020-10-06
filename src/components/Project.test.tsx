import React from 'react';
import { render, waitForElementToBeRemoved } from '@testing-library/react';
import Project from './Project';

test('renders learn react link', async () => {
  const { getByText } = render(<Project />);

  await waitForElementToBeRemoved(() => getByText('Ladataan...'));

  const linkElement = getByText(/haitaton-123/i);
  expect(linkElement).toBeInTheDocument();
});
