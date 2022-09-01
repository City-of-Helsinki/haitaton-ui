import React, { useState } from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { Formik, useFormikContext } from 'formik';
import { TextInput } from 'hds-react';
import * as Yup from 'yup';
import GenericForm from './GenericForm';
import { render } from '../../testUtils/render';

const validationSchema = {
  testInput: Yup.string().required('Please enter a value for input'),
};

function TestForm({ children }: { children: React.ReactNode }) {
  return (
    <Formik
      initialValues={{ testInput: '' }}
      onSubmit={() => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
      }}
      validationSchema={Yup.object().shape({ ...validationSchema })}
    >
      {children}
    </Formik>
  );
}

function Page1() {
  const formik = useFormikContext<{ testInput: string }>();

  return (
    <div>
      <h1>Page 1</h1>
      <TextInput
        id="testInput"
        label="Test input"
        onChange={formik.handleChange}
        value={formik.values.testInput}
        errorText="Please enter a value for input"
      />
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

test('form pages can be navigated and validation works', async () => {
  const formSteps = [
    {
      path: '/',
      element: <Page1 />,
      title: 'Title 1',
      fieldsToValidate: ['testInput'],
    },
    {
      path: '/page2',
      element: <Page2 />,
      title: 'Title 2',
      fieldsToValidate: [],
    },
  ];

  const handleDelete = jest.fn();
  const handleClose = jest.fn();
  const handleSave = jest.fn();

  render(
    <TestForm>
      <GenericForm<{ testInput: string }>
        formSteps={formSteps}
        showNotification=""
        hankeIndexData={null}
        onDelete={handleDelete}
        onClose={handleClose}
        onSave={handleSave}
      />
    </TestForm>
  );

  const nextButtons = screen.getAllByText('Seuraava');
  const prevButtons = screen.getAllByText('Edellinen');
  const nextButtonTop = nextButtons[0];
  const prevButtonTop = prevButtons[0];
  const prevButtonBottom = prevButtons[1];

  fireEvent.click(nextButtonTop);
  await waitFor(() => screen.getByText('Please enter a value for input'));
  expect(screen.getByText('Page 1')).toBeDefined();

  fireEvent.change(screen.getByLabelText('Test input'), { target: { value: 'text' } });
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

test('success and error notifications work', async () => {
  function FormContent() {
    const [showNotification, setShowNotification] = useState('' as 'success' | 'error' | '');

    const formSteps = [
      {
        path: '/',
        element: <Page1 />,
        title: 'Title 1',
        fieldsToValidate: [],
      },
      {
        path: '/page2',
        element: <Page2 />,
        title: 'Title 2',
        fieldsToValidate: [],
      },
    ];

    const handleDelete = jest.fn();

    function handleClose() {
      setShowNotification('error');
    }

    function handleSave() {
      setShowNotification('success');
    }

    return (
      <GenericForm<{ testInput: string }>
        formSteps={formSteps}
        showNotification={showNotification}
        hankeIndexData={null}
        onDelete={handleDelete}
        onClose={handleClose}
        onSave={handleSave}
      />
    );
  }

  render(
    <TestForm>
      <FormContent />
    </TestForm>
  );

  fireEvent.click(screen.getByText('Tallenna luonnos'));
  await waitFor(() =>
    expect(screen.getByText('Luonnos on tallennettu Hankelistalle')).toBeDefined()
  );

  fireEvent.click(screen.getByText('Keskeytä'));
  await waitFor(() =>
    expect(screen.getByText('Luonnosta ei saatu tallennettua, koita uudelleen')).toBeDefined()
  );
});
