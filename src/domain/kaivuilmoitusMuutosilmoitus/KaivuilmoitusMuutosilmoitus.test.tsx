import { HttpResponse, http } from 'msw';
import { cloneDeep } from 'lodash';
import { server } from '../mocks/test-server';
import { Application, KaivuilmoitusData } from '../application/types/application';
import { Muutosilmoitus } from '../application/muutosilmoitus/types';
import { HankeData } from '../types/hanke';
import { fireEvent, render, screen } from '../../testUtils/render';
import KaivuilmoitusMuutosilmoitusContainer from './KaivuilmoitusMuutosilmoitusContainer';
import hankkeet from '../mocks/data/hankkeet-data';
import hakemukset from '../mocks/data/hakemukset-data';
import { HAITTA_INDEX_TYPE, HaittaIndexData } from '../common/haittaIndexes/types';

function setup(
  options: {
    application?: Application<KaivuilmoitusData>;
    muutosilmoitus?: Muutosilmoitus<KaivuilmoitusData>;
    hankeData?: HankeData;
    responseStatus?: number;
  } = {},
) {
  const {
    application = cloneDeep(hakemukset[12]) as Application<KaivuilmoitusData>,
    muutosilmoitus = {
      id: 'c0a1fe7b-326c-4b25-a7bc-d1797762c01d',
      applicationData: application.applicationData,
      sent: new Date('2025-09-01T15:00:00.000Z'),
      muutokset: [],
    },
    hankeData = hankkeet[1] as HankeData,
    responseStatus = 200,
  } = options;
  server.use(
    http.put('/api/muutosilmoitukset/:id', async () => {
      return HttpResponse.json<Muutosilmoitus<KaivuilmoitusData>>(muutosilmoitus, {
        status: responseStatus,
      });
    }),
    http.post('/api/haittaindeksit', async () => {
      return HttpResponse.json<HaittaIndexData>(
        {
          liikennehaittaindeksi: {
            indeksi: 0,
            tyyppi: HAITTA_INDEX_TYPE.PYORALIIKENNEINDEKSI,
          },
          pyoraliikenneindeksi: 0,
          autoliikenne: {
            indeksi: 0,
            haitanKesto: 0,
            katuluokka: 0,
            liikennemaara: 0,
            kaistahaitta: 0,
            kaistapituushaitta: 0,
          },
          linjaautoliikenneindeksi: 0,
          raitioliikenneindeksi: 0,
        },
        { status: responseStatus },
      );
    }),
    http.post('/api/muutosilmoitukset/:id/laheta', async () => {
      return HttpResponse.json<Application>(
        {
          ...application,
          muutosilmoitus: {
            ...muutosilmoitus,
            sent: new Date(),
          },
        },
        { status: responseStatus },
      );
    }),
    http.delete('/api/muutosilmoitukset/:id', async () => {
      return new HttpResponse(null, { status: responseStatus });
    }),
  );
  return {
    ...render(
      <KaivuilmoitusMuutosilmoitusContainer
        hankeData={hankeData}
        originalApplication={application}
        muutosilmoitus={muutosilmoitus}
      />,
      undefined,
      `/fi/kaivuilmoitus-muutosilmoitus/${application.id}/muokkaa`,
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
    expect(window.location.pathname).toBe(
      `/fi/kaivuilmoitus-muutosilmoitus/${application.id}/muokkaa`,
    );
  });
});

describe('Canceling muutosilmoitus', () => {
  test('Should be able to cancel muutosilmoitus', async () => {
    const application = cloneDeep(hakemukset[13]) as Application<KaivuilmoitusData>;
    const { user } = setup({
      application,
      muutosilmoitus: application.muutosilmoitus!,
      responseStatus: 204,
    });
    await user.click(screen.getByRole('button', { name: /peru muutosilmoitus/i }));
    await user.click(await screen.findByRole('button', { name: /vahvista/i }));

    expect(await screen.findByText('Muutosilmoitus peruttiin')).toBeInTheDocument();
    expect(screen.getByText('Muutosilmoitus peruttiin onnistuneesti')).toBeInTheDocument();
    expect(window.location.pathname).toBe('/fi/hakemus/14');
  });
});

describe('Sending muutosilmoitus', () => {
  test('Should be able to send muutosilmoitus', async () => {
    const applicationBase = cloneDeep(hakemukset[13]) as Application<KaivuilmoitusData>;
    const application = {
      ...applicationBase,
      muutosilmoitus: {
        ...applicationBase.muutosilmoitus!,
        sent: null,
        muutokset: ['workDescription'],
      },
    };
    const { user } = setup({
      application: application,
      muutosilmoitus: application.muutosilmoitus,
    });
    await user.click(screen.getByRole('button', { name: /yhteenveto/i }));
    await user.click(screen.getByRole('button', { name: /lähetä muutosilmoitus/i }));
    await user.click(await screen.findByRole('button', { name: /vahvista/i }));

    expect(await screen.findByText('Muutosilmoitus lähetetty')).toBeInTheDocument();
    expect(screen.getByText('Muutosilmoitus on lähetetty käsiteltäväksi.')).toBeInTheDocument();
  });
});
