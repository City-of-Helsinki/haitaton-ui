import { FormProvider, useForm } from 'react-hook-form';
import { cloneDeep } from 'lodash';
import { render, screen, waitFor } from '../../testUtils/render';
import { Geometries } from './Geometries';
import hankkeet from '../mocks/data/hankkeet-data';
import { HankeData } from '../types/hanke';

jest.setTimeout(90000);

function TestComponent({ hankeData }: { hankeData?: HankeData }) {
  const formContext = useForm();

  return (
    <FormProvider {...formContext}>
      <Geometries hankeData={hankeData} />
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

test('Hanke areas are visible if work start and end dates are between hanke start and end dates', async () => {
  const testHanke = hankkeet[1];
  const { user } = render(<TestComponent hankeData={testHanke as HankeData} />);
  await user.type(screen.getByRole('textbox', { name: 'Työn arvioitu alkupäivä *' }), '27.11.2024');
  await user.type(
    screen.getByRole('textbox', { name: 'Työn arvioitu loppupäivä *' }),
    '27.11.2024',
  );

  await waitFor(() => expect(screen.getByTestId('countOfFilteredHankkeet')).toHaveTextContent('1'));

  await user.type(screen.getByRole('textbox', { name: 'Työn arvioitu alkupäivä *' }), '28.11.2024');
  await user.type(
    screen.getByRole('textbox', { name: 'Työn arvioitu loppupäivä *' }),
    '29.11.2024',
  );

  await waitFor(() => expect(screen.getByTestId('countOfFilteredHankkeet')).toHaveTextContent('0'));
});

test('Hanke areas are not visible if hanke is generated', async () => {
  const testHanke = cloneDeep(hankkeet[1]);
  testHanke.generated = true;
  const { user } = render(<TestComponent hankeData={testHanke as HankeData} />);
  await user.type(screen.getByRole('textbox', { name: 'Työn arvioitu alkupäivä *' }), '27.11.2024');
  await user.type(
    screen.getByRole('textbox', { name: 'Työn arvioitu loppupäivä *' }),
    '27.11.2024',
  );

  await waitFor(() =>
    expect(screen.queryByTestId('countOfFilteredHankkeet')).not.toBeInTheDocument(),
  );
});
