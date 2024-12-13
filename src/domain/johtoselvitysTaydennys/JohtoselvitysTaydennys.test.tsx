import { cloneDeep } from 'lodash';
import { HttpResponse, http } from 'msw';
import { fireEvent, render, screen } from '../../testUtils/render';
import JohtoselvitysTaydennysContainer from './JohtoselvitysTaydennysContainer';
import { Application, JohtoselvitysData } from '../application/types/application';
import { HankeData } from '../types/hanke';
import hankkeet from '../mocks/data/hankkeet-data';
import hakemukset from '../mocks/data/hakemukset-data';
import { server } from '../mocks/test-server';
import { Taydennys } from '../application/taydennys/types';
import { SignedInUser } from '../hanke/hankeUsers/hankeUser';

function setup(
  options: {
    application?: Application<JohtoselvitysData>;
    taydennys?: Taydennys<JohtoselvitysData>;
    hankeData?: HankeData;
    responseStatus?: number;
  } = {},
) {
  const {
    application = cloneDeep(hakemukset[10]) as Application<JohtoselvitysData>,
    taydennys = {
      id: 'c0a1fe7b-326c-4b25-a7bc-d1797762c01c',
      applicationData: application.applicationData,
      muutokset: [],
    },
    hankeData = hankkeet[1] as HankeData,
    responseStatus = 200,
  } = options;
  server.use(
    http.put('/api/taydennykset/:id', async () => {
      return HttpResponse.json<Taydennys<JohtoselvitysData>>(taydennys, { status: responseStatus });
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
      <JohtoselvitysTaydennysContainer
        hankeData={hankeData}
        originalApplication={application}
        taydennys={taydennys}
      />,
      undefined,
      `/fi/johtoselvitystaydennys/${application.id}/muokkaa`,
    ),
    application,
  };
}

describe('Saving the form', () => {
  test('Should be able to save and quit', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: /tallenna ja keskeytä/i }));

    expect(screen.queryAllByText(/hakemus tallennettu/i).length).toBe(2);
    expect(window.location.pathname).toBe('/fi/hakemus/11');
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

  test('Should not save and quit if current form page is not valid', async () => {
    const { user, application } = setup({ responseStatus: 500 });
    await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));
    // Change registry key to invalid value
    fireEvent.change(
      screen.getByTestId('applicationData.customerWithContacts.customer.registryKey'),
      {
        target: { value: '2182' },
      },
    );
    await user.click(screen.getByRole('button', { name: /tallenna ja keskeytä/i }));

    expect(await screen.findAllByText('Kentän arvo on virheellinen')).toHaveLength(1);
    expect(window.location.pathname).toBe(`/fi/johtoselvitystaydennys/${application.id}/muokkaa`);
  });

  test('Should show error message and not navigate away when save and quit fails', async () => {
    const { user, application } = setup({ responseStatus: 500 });
    await user.click(screen.getByRole('button', { name: /tallenna ja keskeytä/i }));

    expect(await screen.findAllByText(/tallentaminen epäonnistui/i)).toHaveLength(2);
    expect(window.location.pathname).toBe(`/fi/johtoselvitystaydennys/${application.id}/muokkaa`);
  });
});

describe('Taydennyspyynto notification', () => {
  test('Should show taydennyspyynto notification', async () => {
    setup();

    expect(screen.getByRole('heading', { name: 'Täydennyspyyntö' })).toBeInTheDocument();
    expect(screen.getByText('Muokkaa hakemusta korjataksesi seuraavat asiat:')).toBeInTheDocument();
  });
});

describe('Sending taydennys', () => {
  test('Should be able to send the form', async () => {
    const { user } = setup({
      taydennys: {
        id: 'c0a1fe7b-326c-4b25-a7bc-d1797762c01c',
        applicationData: cloneDeep(hakemukset[10] as Application<JohtoselvitysData>)
          .applicationData,
        muutokset: ['name'],
      },
    });
    await user.click(screen.getByRole('button', { name: /yhteenveto/i }));
    await user.click(screen.getByRole('button', { name: /lähetä täydennys/i }));
    await user.click(await screen.findByRole('button', { name: /vahvista/i }));

    expect(await screen.findByText(/täydennys lähetetty/i)).toBeInTheDocument();
    expect(window.location.pathname).toBe('/fi/hakemus/11');
  });

  test('Should show error message if sending fails', async () => {
    const { user } = setup({
      taydennys: {
        id: 'c0a1fe7b-326c-4b25-a7bc-d1797762c01c',
        applicationData: cloneDeep(hakemukset[10] as Application<JohtoselvitysData>)
          .applicationData,
        muutokset: ['name'],
      },
      responseStatus: 500,
    });
    await user.click(screen.getByRole('button', { name: /yhteenveto/i }));
    await user.click(screen.getByRole('button', { name: /lähetä täydennys/i }));
    await user.click(await screen.findByRole('button', { name: /vahvista/i }));

    expect(screen.getByText(/täydennyksen lähettäminen epäonnistui/i)).toBeInTheDocument();
  });

  test('Should not show send button if there are no changes', async () => {
    const { user } = setup({
      taydennys: {
        id: 'c0a1fe7b-326c-4b25-a7bc-d1797762c01c',
        applicationData: cloneDeep(hakemukset[10] as Application<JohtoselvitysData>)
          .applicationData,
        muutokset: [],
      },
    });
    await user.click(screen.getByRole('button', { name: /yhteenveto/i }));

    expect(screen.queryByRole('button', { name: /lähetä täydennys/i })).not.toBeInTheDocument();
  });

  test('Should not show send button if form is not valid', async () => {
    const { user } = setup({
      taydennys: {
        id: 'c0a1fe7b-326c-4b25-a7bc-d1797762c01c',
        applicationData: cloneDeep(hakemukset[10] as Application<JohtoselvitysData>)
          .applicationData,
        muutokset: ['workDescription'],
      },
    });

    // Change work description to invalid value
    fireEvent.change(screen.getByLabelText(/työn kuvaus/i), {
      target: { value: '' },
    });
    await user.click(screen.getByRole('button', { name: /yhteenveto/i }));

    expect(screen.queryByRole('button', { name: /lähetä täydennys/i })).not.toBeInTheDocument();
  });

  test('Should show and disable send button and show notification when user is not a contact person', async () => {
    server.use(
      http.get('/api/hankkeet/:hankeTunnus/whoami', async () => {
        return HttpResponse.json<SignedInUser>({
          hankeKayttajaId: 'not-a-contact-person-id',
          kayttooikeustaso: 'KATSELUOIKEUS',
          kayttooikeudet: ['VIEW'],
        });
      }),
    );

    const { user } = setup({
      taydennys: {
        id: 'c0a1fe7b-326c-4b25-a7bc-d1797762c01c',
        applicationData: cloneDeep(hakemukset[10] as Application<JohtoselvitysData>)
          .applicationData,
        muutokset: ['name'],
      },
    });

    await user.click(screen.getByRole('button', { name: /yhteenveto/i }));

    expect(screen.queryByRole('button', { name: /lähetä täydennys/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /lähetä täydennys/i })).toBeDisabled();
    expect(
      screen.queryAllByText(
        'Hakemuksen voi lähettää ainoastaan hakemuksen yhteyshenkilönä oleva henkilö.',
      ),
    ).toHaveLength(2);
  });
});

describe('Canceling taydennys', () => {
  test('Should be able to cancel taydennys', async () => {
    const application = cloneDeep(hakemukset[10]) as Application<JohtoselvitysData>;
    application.taydennys = {
      id: 'c0a1fe7b-326c-4b25-a7bc-d1797762c01c',
      applicationData: application.applicationData,
      muutokset: [],
    };
    const { user } = setup({
      application,
      taydennys: application.taydennys,
    });
    await user.click(screen.getByRole('button', { name: /peru täydennysluonnos/i }));
    await user.click(await screen.findByRole('button', { name: /vahvista/i }));

    expect(await screen.findByText('Täydennysluonnos peruttiin')).toBeInTheDocument();
    expect(screen.getByText('Täydennysluonnos peruttiin onnistuneesti')).toBeInTheDocument();
    expect(window.location.pathname).toBe('/fi/hakemus/11');
  });
});

describe('Error notification', () => {
  test('Should show fields with errors in notification in perustiedot page', async () => {
    setup();

    expect(
      screen.queryByText('Seuraavat kentät tällä sivulla vaaditaan hakemuksen lähettämiseksi:'),
    ).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/työn nimi/i), {
      target: { value: '' },
    });
    fireEvent.change(screen.getByLabelText(/katuosoite/i), {
      target: { value: '' },
    });
    fireEvent.change(screen.getByLabelText(/työn kuvaus/i), {
      target: { value: '' },
    });
    fireEvent.click(screen.getByLabelText(/uuden rakenteen tai johdon rakentamisesta/i));
    fireEvent.click(screen.getByLabelText(/olemassaolevan rakenteen kunnossapitotyöstä/i));

    expect(
      await screen.findByText(
        'Seuraavat kentät tällä sivulla vaaditaan hakemuksen lähettämiseksi:',
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /työn nimi/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /katuosoite/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /työn kuvaus/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /työssä on kyse/i })).toBeInTheDocument();
  });

  test('Should show fields with errors in notification in alueet page', async () => {
    const { user } = setup();

    await user.click(screen.getByRole('button', { name: /alueet/i }));

    expect(
      screen.queryByText('Seuraavat kentät tällä sivulla vaaditaan hakemuksen lähettämiseksi:'),
    ).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/työn arvioitu alkupäivä/i), {
      target: { value: '' },
    });
    fireEvent.change(screen.getByLabelText(/työn arvioitu loppupäivä/i), {
      target: { value: '' },
    });

    expect(
      await screen.findByText(
        'Seuraavat kentät tällä sivulla vaaditaan hakemuksen lähettämiseksi:',
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /työn arvioitu alkupäivä/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /työn arvioitu loppupäivä/i })).toBeInTheDocument();
  });

  test('Should show fields with errors in notification in yhteystiedot page', async () => {
    const { user } = setup();

    await user.click(screen.getByRole('button', { name: /yhteystiedot/i }));

    expect(
      screen.queryByText('Seuraavat kentät tällä sivulla vaaditaan hakemuksen lähettämiseksi:'),
    ).not.toBeInTheDocument();

    fireEvent.change(screen.getAllByRole('combobox', { name: /nimi/i })[0], {
      target: { value: '' },
    });
    fireEvent.change(
      screen.getByTestId('applicationData.customerWithContacts.customer.registryKey'),
      {
        target: { value: '123' },
      },
    );
    fireEvent.change(screen.getByTestId('applicationData.customerWithContacts.customer.email'), {
      target: { value: '' },
    });
    fireEvent.change(screen.getByTestId('applicationData.customerWithContacts.customer.phone'), {
      target: { value: '' },
    });
    fireEvent.click(screen.getAllByRole('button', { name: /poista valittu/i })[0]);

    expect(
      await screen.findByText(
        'Seuraavat kentät tällä sivulla vaaditaan hakemuksen lähettämiseksi:',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', {
        name: /työstä vastaava: Vähintään yksi yhteyshenkilö tulee olla asetettuna/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Työstä vastaava: Sähköposti/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Työstä vastaava: Puhelin/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Työstä vastaava: Nimi/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Työstä vastaava: Y-tunnus/i })).toBeInTheDocument();
  });

  test('Should show pages that have errors in summary page', async () => {
    const applicationData = cloneDeep(
      hakemukset[10] as Application<JohtoselvitysData>,
    ).applicationData;
    const { user } = setup({
      taydennys: {
        id: 'c0a1fe7b-326c-4b25-a7bc-d1797762c01c',
        applicationData: {
          ...applicationData,
          workDescription: '',
          startTime: null,
          customerWithContacts: {
            ...applicationData.customerWithContacts,
            customer: {
              ...applicationData.customerWithContacts!.customer,
              name: '',
              registryKey: '123',
              email: '',
              phone: '',
            },
            contacts: [],
          },
        },
        muutokset: [],
      },
    });
    await user.click(screen.getByRole('button', { name: /yhteenveto/i }));

    expect(
      await screen.findByText(
        'Seuraavissa vaiheissa on puuttuvia tietoja hakemuksen lähettämiseksi:',
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole('listitem', { name: /perustiedot/i })).toBeInTheDocument();
    expect(screen.getByRole('listitem', { name: /alueet/i })).toBeInTheDocument();
    expect(screen.getByRole('listitem', { name: /yhteystiedot/i })).toBeInTheDocument();
  });
});
