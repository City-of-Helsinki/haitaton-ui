import { UserEvent } from '@testing-library/user-event/dist/types/setup/setup';
import { cleanup, fireEvent, render, screen } from '../../testUtils/render';
import KaivuilmoitusContainer from './KaivuilmoitusContainer';
import { HankeData } from '../types/hanke';
import hankkeet from '../mocks/data/hankkeet-data';

afterEach(cleanup);

jest.setTimeout(40000);

async function fillBasicInformation(
  user: UserEvent,
  options: {
    name?: string;
    description?: string;
    placementContract?: string;
  } = {},
) {
  const {
    name = 'Kaivuilmoitus',
    description = 'Testataan kaivuilmoituslomaketta',
    placementContract = 'SL0000001',
  } = options;

  fireEvent.change(screen.getByLabelText(/työn nimi/i), {
    target: { value: name },
  });

  fireEvent.change(screen.getByLabelText(/työn kuvaus/i), {
    target: { value: description },
  });

  fireEvent.click(screen.getByLabelText(/uuden rakenteen tai johdon rakentamisesta/i));

  await screen.findAllByLabelText(/tehtyjen johtoselvitysten tunnukset/i);
  fireEvent.click(
    screen.getByRole('button', {
      name: 'Tehtyjen johtoselvitysten tunnukset: Sulje ja avaa valikko',
    }),
  );
  fireEvent.click(screen.getByText(/JS2300001/));
  fireEvent.change(screen.getByRole('combobox'), {
    target: { value: 'JS2300003' },
  });
  await user.keyboard('{Enter}');

  fireEvent.change(screen.getByLabelText(/sijoitussopimustunnus/i), {
    target: { value: placementContract },
  });
  fireEvent.click(screen.getByRole('button', { name: /lisää/i }));

  fireEvent.click(screen.getByRole('checkbox', { name: /työstä vastaavana/i }));
}

test('Should be able fill perustiedot and save form', async () => {
  const hankeData = hankkeet[1] as HankeData;
  const { user } = render(<KaivuilmoitusContainer hankeData={hankeData} />);
  await fillBasicInformation(user);
  await user.click(screen.getByRole('button', { name: /tallenna ja keskeytä/i }));

  expect(screen.queryByText(/hakemus tallennettu/i)).toBeInTheDocument();
  expect(window.location.pathname).toBe('/fi/hankesalkku/HAI22-2');
});

test('Should not be able to save form if work name is missing', async () => {
  const hankeData = hankkeet[1] as HankeData;
  const { user } = render(<KaivuilmoitusContainer hankeData={hankeData} />);
  await fillBasicInformation(user, { name: '' });
  await user.click(screen.getByRole('button', { name: /tallenna ja keskeytä/i }));

  expect(screen.getByText('Vaihe 1/1: Perustiedot')).toBeInTheDocument();
  expect(screen.queryAllByText('Kenttä on pakollinen').length).toBe(1);
});
