import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { render, screen } from '../../testUtils/render';
import { Geometries } from './Geometries';

jest.setTimeout(30000);

function TestComponent() {
  const formContext = useForm();

  return (
    <FormProvider {...formContext}>
      <Geometries />
    </FormProvider>
  );
}

test('Areas can be added after start and end dates have been set', async () => {
  const { user } = render(<TestComponent />);

  expect(
    screen.queryByText('Valitse työn päivämäärät piirtääksesi selvitettävät alueet kartalle.'),
  ).toBeInTheDocument();
  expect(screen.queryByTestId('draw-control-Square')).not.toBeInTheDocument();
  expect(screen.queryByTestId('draw-control-Polygon')).not.toBeInTheDocument();

  await user.type(screen.getByRole('textbox', { name: 'Työn arvioitu alkupäivä *' }), '13.4.2024');
  await user.type(screen.getByRole('textbox', { name: 'Työn arvioitu loppupäivä *' }), '30.4.2024');

  expect(
    screen.queryByText('Valitse työn päivämäärät piirtääksesi selvitettävät alueet kartalle.'),
  ).not.toBeInTheDocument();
  expect(screen.queryByTestId('draw-control-Square')).toBeInTheDocument();
  expect(screen.queryByTestId('draw-control-Polygon')).toBeInTheDocument();
});
