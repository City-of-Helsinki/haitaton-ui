import React from 'react';
import { TextInput } from 'hds-react';
import GenericForm from './GenericForm';
import { render, fireEvent, screen, waitFor } from '../../testUtils/render';

function Page1() {
  return (
    <div>
      <h1>Page 1</h1>
      <TextInput id="testInput" label="Test input" errorText="Please enter a value for input" />
    </div>
  );
}

function Page2() {
  return (
    <div>
      <h1>Page 2</h1>
    </div>
  );
}

test('form pages can be navigated', async () => {
  const formSteps = [
    {
      path: '/',
      element: <Page1 />,
      title: 'Title 1',
    },
    {
      path: '/page2',
      element: <Page2 />,
      title: 'Title 2',
    },
  ];

  const handleDelete = jest.fn();
  const handleClose = jest.fn();
  const handleSave = jest.fn();

  render(
    <GenericForm
      formSteps={formSteps}
      isFormValid
      onDelete={handleDelete}
      onClose={handleClose}
      onSave={handleSave}
    />
  );

  const nextButtons = screen.getAllByRole('button', { name: 'Seuraava' });
  const prevButtons = screen.getAllByRole('button', { name: 'Edellinen' });
  const nextButtonTop = nextButtons[0];
  const prevButtonTop = prevButtons[0];
  const prevButtonBottom = prevButtons[1];

  fireEvent.click(nextButtonTop);
  await waitFor(() => expect(handleSave).toHaveBeenCalledTimes(1));
  expect(screen.getByText('Page 2')).toBeDefined();

  fireEvent.click(prevButtonBottom);
  await waitFor(() => expect(handleSave).toHaveBeenCalledTimes(2));
  expect(screen.getByText('Page 1')).toBeDefined();

  fireEvent.click(screen.getAllByText('Seuraava')[1]);
  await waitFor(() => expect(handleSave).toHaveBeenCalledTimes(3));
  expect(screen.getByText('Page 2')).toBeDefined();

  fireEvent.click(prevButtonTop);
  await waitFor(() => expect(handleSave).toHaveBeenCalledTimes(4));
  expect(screen.getByText('Page 1')).toBeDefined();
});

test('next and save buttons are disabled when form is not valid', () => {
  const formSteps = [
    {
      path: '/',
      element: <Page1 />,
      title: 'Title 1',
    },
    {
      path: '/page2',
      element: <Page2 />,
      title: 'Title 2',
    },
  ];

  const handleDelete = jest.fn();
  const handleClose = jest.fn();
  const handleSave = jest.fn();

  render(
    <GenericForm
      formSteps={formSteps}
      isFormValid={false}
      onDelete={handleDelete}
      onClose={handleClose}
      onSave={handleSave}
    />
  );

  expect(screen.getAllByRole('button', { name: 'Seuraava' })[0]).toBeDisabled();
  expect(screen.getAllByRole('button', { name: 'Seuraava' })[1]).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Tallenna luonnos' })).toBeDisabled();
});
