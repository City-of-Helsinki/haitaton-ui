import { cloneDeep } from 'lodash';
import { Application, KaivuilmoitusData } from '../application/types/application';
import { HankeData } from '../types/hanke';
import hankkeet from '../mocks/data/hankkeet-data';
import hakemukset from '../mocks/data/hakemukset-data';
import { server } from '../mocks/test-server';
import { HttpResponse, http } from 'msw';
import { Taydennys } from '../application/taydennys/types';
import { fireEvent, render, screen } from '../../testUtils/render';
import KaivuilmoitusTaydennysContainer from './KaivuilmoitusTaydennysContainer';

function setup(
  options: {
    application?: Application<KaivuilmoitusData>;
    taydennys?: Taydennys<KaivuilmoitusData>;
    hankeData?: HankeData;
    responseStatus?: number;
  } = {},
) {
  const {
    application = cloneDeep(hakemukset[12]) as Application<KaivuilmoitusData>,
    taydennys = {
      id: 'c0a1fe7b-326c-4b25-a7bc-d1797762c01d',
      applicationData: application.applicationData,
      muutokset: [],
      liitteet: [],
    },
    hankeData = hankkeet[1] as HankeData,
    responseStatus = 200,
  } = options;
  server.use(
    http.put('/api/taydennykset/:id', async () => {
      return HttpResponse.json<Taydennys<KaivuilmoitusData>>(taydennys, {
        status: responseStatus,
      });
    }),
    http.post('/api/taydennykset/:id/laheta', async () => {
      return HttpResponse.json(application, { status: responseStatus });
    }),
    http.delete('/api/taydennykset/:id', async () => {
      return new HttpResponse(null, { status: responseStatus });
    }),
  );
  return {
    ...render(
      <KaivuilmoitusTaydennysContainer
        hankeData={hankeData}
        originalApplication={application}
        taydennys={taydennys}
      />,
      undefined,
      `/fi/kaivuilmoitustaydennys/${application.id}/muokkaa`,
    ),
    application,
  };
}

describe('Saving the form', () => {
  test('Should be able to save and quit', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: /tallenna ja keskeytä/i }));

    expect(screen.queryAllByText(/hakemus tallennettu/i).length).toBe(2);
    expect(window.location.pathname).toBe('/fi/hakemus/13');
  });

  test('Should save on page change', async () => {
    const { user } = setup();
    fireEvent.change(screen.getByLabelText(/työn kuvaus/i), {
      target: { value: 'Muuttunut kuvaus' },
    });
    await user.click(screen.getByRole('button', { name: /seuraava/i }));

    expect(screen.getByText(/hakemus tallennettu/i)).toBeInTheDocument();
  });

  test('Should show error message if saving fails', async () => {
    const { user } = setup({ responseStatus: 500 });
    fireEvent.change(screen.getByLabelText(/työn kuvaus/i), {
      target: { value: 'Muuttunut kuvaus' },
    });
    await user.click(screen.getByRole('button', { name: /seuraava/i }));

    expect(screen.getAllByText(/tallentaminen epäonnistui/i)[0]).toBeInTheDocument();
  });

  test('Should show error message and not navigate away when save and quit fails', async () => {
    const { user, application } = setup({ responseStatus: 500 });
    await user.click(screen.getByRole('button', { name: /tallenna ja keskeytä/i }));

    expect(await screen.findAllByText(/tallentaminen epäonnistui/i)).toHaveLength(2);
    expect(window.location.pathname).toBe(`/fi/kaivuilmoitustaydennys/${application.id}/muokkaa`);
  });
});

describe('Taydennyspyynto notification', () => {
  test('Should show taydennyspyynto notification', async () => {
    setup();

    expect(screen.getByRole('heading', { name: 'Täydennyspyyntö' })).toBeInTheDocument();
    expect(screen.getByText('Muokkaa hakemusta korjataksesi seuraavat asiat:')).toBeInTheDocument();
  });
});

describe('Canceling taydennys', () => {
  test('Should be able to cancel taydennys', async () => {
    const application = cloneDeep(hakemukset[12]) as Application<KaivuilmoitusData>;
    application.taydennys = {
      id: 'c0a1fe7b-326c-4b25-a7bc-d1797762c01d',
      applicationData: application.applicationData,
      muutokset: [],
      liitteet: [],
    };
    const { user } = setup({
      application,
      taydennys: application.taydennys,
    });
    await user.click(screen.getByRole('button', { name: /peru täydennysluonnos/i }));
    await user.click(await screen.findByRole('button', { name: /vahvista/i }));

    expect(await screen.findByText('Täydennysluonnos peruttiin')).toBeInTheDocument();
    expect(screen.getByText('Täydennysluonnos peruttiin onnistuneesti')).toBeInTheDocument();
    expect(window.location.pathname).toBe('/fi/hakemus/13');
  });
});
