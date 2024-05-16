import { UserEvent } from '@testing-library/user-event/dist/types/setup/setup';
import { cleanup, fireEvent, render, screen } from '../../testUtils/render';
import KaivuilmoitusContainer from './KaivuilmoitusContainer';
import { HankeData } from '../types/hanke';
import hankkeet from '../mocks/data/hankkeet-data';
import { server } from '../mocks/test-server';
import { rest } from 'msw';

afterEach(cleanup);

jest.setTimeout(40000);

async function fillBasicInformation(
  user: UserEvent,
  options: {
    name?: string;
    description?: string;
    existingCableReport?: string;
    cableReports?: string[];
    placementContracts?: string[];
    requiredCompetence?: boolean;
  } = {},
) {
  const {
    name = 'Kaivuilmoitus',
    description = 'Testataan kaivuilmoituslomaketta',
    existingCableReport = 'JS2300001',
    cableReports = ['JS2300003'],
    placementContracts = ['SL0000001'],
    requiredCompetence = true,
  } = options;

  fireEvent.change(screen.getByLabelText(/työn nimi/i), {
    target: { value: name },
  });

  fireEvent.change(screen.getByLabelText(/työn kuvaus/i), {
    target: { value: description },
  });

  fireEvent.click(screen.getByLabelText(/uuden rakenteen tai johdon rakentamisesta/i));

  if (existingCableReport) {
    await screen.findAllByLabelText(/tehtyjen johtoselvitysten tunnukset/i);
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Tehtyjen johtoselvitysten tunnukset: Sulje ja avaa valikko',
      }),
    );
    fireEvent.click(screen.getByText(existingCableReport));
  }

  for (const cableReport of cableReports) {
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: cableReport },
    });
    await user.keyboard('{Enter}');
  }

  for (const placementContract of placementContracts) {
    fireEvent.change(screen.getByLabelText('Sijoitussopimustunnus'), {
      target: { value: placementContract },
    });
    fireEvent.click(screen.getByRole('button', { name: /lisää/i }));
  }

  if (requiredCompetence) {
    // Check 'Työhön vaadittava pätevyys' checkbox
    fireEvent.click(screen.getByRole('checkbox', { name: /työstä vastaavana/i }));
  }
}

test('Should be able fill perustiedot and save form', async () => {
  const hankeData = hankkeet[1] as HankeData;
  const { user } = render(<KaivuilmoitusContainer hankeData={hankeData} />);
  await fillBasicInformation(user);
  await user.click(screen.getByRole('button', { name: /tallenna ja keskeytä/i }));

  expect(screen.queryAllByText(/hakemus tallennettu/i).length).toBe(2);
  expect(window.location.pathname).toBe('/fi/hankesalkku/HAI22-2');
});

test('Should not be able to save form if work name is missing', async () => {
  const hankeData = hankkeet[1] as HankeData;
  const { user } = render(<KaivuilmoitusContainer hankeData={hankeData} />);
  await fillBasicInformation(user, { name: '' });
  await user.click(screen.getByRole('button', { name: /tallenna ja keskeytä/i }));

  expect(screen.getByText('Vaihe 1/2: Perustiedot')).toBeInTheDocument();
  expect(screen.queryAllByText('Kenttä on pakollinen').length).toBe(1);
});

test('Should show error message if saving fails', async () => {
  server.use(
    rest.post('/api/hakemukset', async (req, res, ctx) => {
      return res(ctx.status(500), ctx.json({ errorMessage: 'Failed for testing purposes' }));
    }),
  );
  const hankeData = hankkeet[1] as HankeData;
  const { user } = render(<KaivuilmoitusContainer hankeData={hankeData} />);
  await fillBasicInformation(user);
  await user.click(screen.getByRole('button', { name: /tallenna ja keskeytä/i }));

  expect(screen.getByText('Vaihe 1/2: Perustiedot')).toBeInTheDocument();
  expect(screen.getAllByText(/tallentaminen epäonnistui/i)[0]).toBeInTheDocument();
});

test('Should show filled information in summary page', async () => {
  const name = 'Kaivuilmoitus testi';
  const description = 'Testataan yhteenvetosivua';
  const existingCableReport = 'JS2300001';
  const cableReports = ['JS2300002', 'JS2300003', 'JS2300004'];
  const placementContracts = ['SL0000001', 'SL0000002'];
  const hankeData = hankkeet[1] as HankeData;
  const { user } = render(<KaivuilmoitusContainer hankeData={hankeData} />);
  await fillBasicInformation(user, {
    name,
    description,
    existingCableReport,
    cableReports,
    placementContracts,
  });
  await user.click(screen.getByRole('button', { name: /seuraava/i }));

  expect(screen.getByText('Vaihe 2/2: Yhteenveto')).toBeInTheDocument();
  expect(screen.getByText(name)).toBeInTheDocument();
  expect(screen.getByText(description)).toBeInTheDocument();
  expect(
    screen.getByText(`${existingCableReport}, ${cableReports.join(', ')}`),
  ).toBeInTheDocument();
  expect(screen.getByText(placementContracts.join(', '))).toBeInTheDocument();
  expect(screen.getByText('Kyllä')).toBeInTheDocument();
});
