import { http, HttpResponse, delay } from 'msw';
import { render, screen, within } from '../../../testUtils/render';
import ApplicationViewContainer from './ApplicationViewContainer';
import { waitForLoadingToFinish } from '../../../testUtils/helperFunctions';
import { server } from '../../mocks/test-server';
import { SignedInUser } from '../../hanke/hankeUsers/hankeUser';
import * as applicationApi from '../utils';
import hakemukset from '../../mocks/data/hakemukset-data';
import { cloneDeep } from 'lodash';
import { format } from 'date-fns/format';
import { fi } from 'date-fns/locale';

describe('Cable report application view', () => {
  test('Correct information about application should be displayed', async () => {
    render(<ApplicationViewContainer id={4} />);
    await waitForLoadingToFinish();

    expect(screen.getAllByText('Mannerheimintien kairaukset').length).toBe(2);
    expect(screen.queryByText('JS2300003')).toBeInTheDocument();
    expect(screen.queryByText('Odottaa käsittelyä')).toBeInTheDocument();
    expect(screen.queryByText('Kaikki oikeudet')).toBeInTheDocument();
  });

  test('Link back to related hanke should work', async () => {
    const { user } = render(<ApplicationViewContainer id={4} />);
    await waitForLoadingToFinish();

    await user.click(screen.getByRole('link', { name: 'Mannerheimintien kaukolämpö (HAI22-3)' }));

    expect(window.location.pathname).toBe('/fi/hankesalkku/HAI22-3');
  });

  test('Should show error notification if application is not found', async () => {
    server.use(
      http.get('/api/hakemukset/:id', async () => {
        return HttpResponse.json({ errorMessage: 'Failed for testing purposes' }, { status: 404 });
      }),
    );

    render(<ApplicationViewContainer id={4} />);
    await waitForLoadingToFinish();

    expect(await screen.findByText('Hakemusta ei löytynyt')).toBeInTheDocument();
  });

  test('Should show error notification if loading application fails', async () => {
    server.use(
      http.get('/api/hakemukset/:id', async () => {
        return HttpResponse.json({ errorMessage: 'Failed for testing purposes' }, { status: 500 });
      }),
    );

    render(<ApplicationViewContainer id={4} />);
    await waitForLoadingToFinish();

    expect(await screen.findByText('Virhe tietojen lataamisessa.')).toBeInTheDocument();
    expect(await screen.findByText('Yritä hetken päästä uudelleen.')).toBeInTheDocument();
  });

  test('Should be able to go editing application when editing is possible', async () => {
    const { user } = render(<ApplicationViewContainer id={1} />);

    await screen.findByRole('button', { name: 'Muokkaa hakemusta' }, { timeout: 10000 });
    await user.click(screen.getByRole('button', { name: 'Muokkaa hakemusta' }));

    expect(window.location.pathname).toBe('/fi/johtoselvityshakemus/1/muokkaa');
  });

  test('Application edit button should not be displayed when editing is not possible', async () => {
    render(<ApplicationViewContainer id={2} />);
    await waitForLoadingToFinish();

    expect(screen.queryByRole('button', { name: 'Muokkaa hakemusta' })).not.toBeInTheDocument();
  });

  test('Should be able to cancel application if it is possible', async () => {
    const { user } = render(<ApplicationViewContainer id={4} />);
    await waitForLoadingToFinish();

    await screen.findByRole('button', { name: 'Peru hakemus' }, { timeout: 10000 });
    await user.click(screen.getByRole('button', { name: 'Peru hakemus' }));
    await user.click(screen.getByRole('button', { name: 'Vahvista' }));

    expect(window.location.pathname).toBe('/fi/hankesalkku/HAI22-3');
    await screen.findByText('Hakemus peruttiin onnistuneesti');
    expect(screen.queryByText('Hakemus peruttiin onnistuneesti')).toBeInTheDocument();
  });

  test('Should not be able to cancel application if it has moved to handling in Allu', async () => {
    render(<ApplicationViewContainer id={3} />);
    await waitForLoadingToFinish();

    expect(screen.queryByRole('button', { name: 'Peru hakemus' })).not.toBeInTheDocument();
  });

  test('Should be able to send application without paper decision order', async () => {
    const hakemus = cloneDeep(hakemukset[0]);
    server.use(
      http.get(`/api/hakemukset/:id`, async () => {
        return HttpResponse.json(hakemus);
      }),
      http.post(`/api/hakemukset/:id/laheta`, async () => {
        hakemus.alluStatus = 'PENDING';
        return HttpResponse.json(hakemus);
      }),
    );

    const { user } = render(<ApplicationViewContainer id={1} />);
    await waitForLoadingToFinish();

    const sendButton = await screen.findByRole('button', { name: 'Lähetä hakemus' });
    expect(sendButton).toBeEnabled();
    await user.click(sendButton);

    expect(await screen.findByText('Lähetä hakemus?')).toBeInTheDocument();
    const confirmButton = screen.getByRole('button', { name: 'Vahvista' });
    expect(confirmButton).toBeEnabled();
    await user.click(confirmButton);

    expect(await screen.findByText('Hakemus lähetetty')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Lähetä hakemus' })).not.toBeInTheDocument();
  });

  test('Should be able to send application with paper decision order', async () => {
    const hakemus = cloneDeep(hakemukset[0]);
    server.use(
      http.get(`/api/hakemukset/:id`, async () => {
        return HttpResponse.json(hakemus);
      }),
      http.post(`/api/hakemukset/:id/laheta`, async () => {
        hakemus.alluStatus = 'PENDING';
        return HttpResponse.json(hakemus);
      }),
    );

    const { user } = render(<ApplicationViewContainer id={1} />);
    await waitForLoadingToFinish();

    const sendButton = await screen.findByRole('button', { name: 'Lähetä hakemus' });
    expect(sendButton).toBeEnabled();
    await user.click(sendButton);

    expect(await screen.findByText('Lähetä hakemus?')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Tilaan päätöksen myös paperisena' }));

    const confirmButton = screen.getByRole('button', { name: 'Vahvista' });
    expect(confirmButton).toBeDisabled();

    expect(await screen.findByText('Täytä vastaanottajan tiedot')).toBeInTheDocument();
    const nameInput = screen.getByText('Nimi');
    await user.type(nameInput, 'Pekka Paperinen');
    const streetAddressInput = screen.getByText('Katuosoite');
    await user.type(streetAddressInput, 'Paperipolku 3 A 4');
    const postalCodeInput = screen.getByText('Postinumero');
    await user.type(postalCodeInput, '00451');
    const cityInput = screen.getByText('Postitoimipaikka');
    await user.type(cityInput, 'Helsinki');

    expect(confirmButton).toBeEnabled();
    await user.click(confirmButton);

    expect(await screen.findByText('Hakemus lähetetty')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Lähetä hakemus' })).not.toBeInTheDocument();
  });

  test('Should not be able to send application if it has moved to handling in Allu', async () => {
    render(<ApplicationViewContainer id={3} />);
    await waitForLoadingToFinish();

    expect(screen.queryByRole('button', { name: 'Lähetä hakemus' })).not.toBeInTheDocument();
  });

  test('Should disable Send button if user is not a contact person on application', async () => {
    server.resetHandlers();
    server.use(
      http.get('/api/hankkeet/:hankeTunnus/whoami', async () => {
        return HttpResponse.json<SignedInUser>({
          hankeKayttajaId: '3fa85f64-5717-4562-b3fc-2c963f66afb4',
          kayttooikeustaso: 'HAKEMUSASIOINTI',
          kayttooikeudet: ['EDIT_APPLICATIONS'],
        });
      }),
    );

    render(<ApplicationViewContainer id={1} />);

    await screen.findByRole('button', { name: 'Lähetä hakemus' }, { timeout: 10000 });
    const sendButton = screen.getByRole('button', { name: 'Lähetä hakemus' });
    expect(sendButton).toBeDisabled();
  });

  test('Should not show Edit, Cancel or Send buttons if user does not have correct permission', async () => {
    server.resetHandlers();
    server.use(
      http.get('/api/hankkeet/:hankeTunnus/whoami', async () => {
        return HttpResponse.json<SignedInUser>({
          hankeKayttajaId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          kayttooikeustaso: 'KATSELUOIKEUS',
          kayttooikeudet: ['VIEW'],
        });
      }),
    );

    render(<ApplicationViewContainer id={1} />);

    await waitForLoadingToFinish();

    expect(screen.queryByRole('button', { name: 'Muokkaa hakemusta' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Peru hakemus' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Lähetä hakemus' })).not.toBeInTheDocument();
  });

  test('Should not send multiple requests if clicking application cancel confirm button many times', async () => {
    server.use(
      http.delete('/api/hakemukset/:id', async () => {
        await delay(200);
        return new HttpResponse();
      }),
    );

    const cancelApplication = jest.spyOn(applicationApi, 'cancelApplication');
    const { user } = render(<ApplicationViewContainer id={1} />);

    await waitForLoadingToFinish();
    await screen.findByRole('button', { name: 'Peru hakemus' });

    await user.click(screen.getByRole('button', { name: 'Peru hakemus' }));
    const confirmCancelButton = screen.getByRole('button', { name: 'Vahvista' });
    await user.click(confirmCancelButton);
    await user.click(confirmCancelButton);
    await user.click(confirmCancelButton);
    await screen.findByText('Hakemus peruttiin onnistuneesti');

    expect(cancelApplication).toHaveBeenCalledTimes(1);

    cancelApplication.mockRestore();
  });

  test('Should not send multiple requests if clicking Send button many times', async () => {
    server.use(
      http.post('/api/hakemukset/:id/laheta', async () => {
        await delay(200);
        return new HttpResponse();
      }),
    );
    const sendApplication = jest.spyOn(applicationApi, 'sendApplication');
    const { user } = render(<ApplicationViewContainer id={1} />);
    await waitForLoadingToFinish();

    const sendButton = await screen.findByRole('button', { name: 'Lähetä hakemus' });
    await user.click(sendButton);

    expect(await screen.findByText('Lähetä hakemus?')).toBeInTheDocument();
    const confirmButton = screen.getByRole('button', { name: 'Vahvista' });
    expect(confirmButton).toBeEnabled();
    await user.click(confirmButton);
    await user.click(confirmButton);
    await user.click(confirmButton);

    await screen.findByText('Hakemus on lähetetty käsiteltäväksi.');

    expect(sendApplication).toHaveBeenCalledTimes(1);

    sendApplication.mockRestore();
  });

  test('Shows decision links if decisions are available', async () => {
    render(<ApplicationViewContainer id={9} />);
    await waitForLoadingToFinish();

    expect(screen.getByText('Lataa päätös (PDF)')).toBeInTheDocument();
  });

  describe('Contacts', () => {
    test('Shows paper decision contact information when there is data', async () => {
      const { user } = render(<ApplicationViewContainer id={9} />);
      await waitForLoadingToFinish();
      await user.click(screen.getByRole('tab', { name: /yhteystiedot/i }));
      const { getByText } = within(screen.getByRole('tabpanel', { name: /yhteystiedot/i }));

      expect(getByText('Päätös tilattu paperisena')).toBeInTheDocument();
      expect(getByText('Pekka Paperinen')).toBeInTheDocument();
      expect(getByText('Paperipolku 3 A 4')).toBeInTheDocument();
      expect(getByText('00451 Helsinki')).toBeInTheDocument();
    });

    test('Does not show paper decision contact information when there is no data', async () => {
      const { user } = render(<ApplicationViewContainer id={1} />);
      await waitForLoadingToFinish();
      await user.click(screen.getByRole('tab', { name: /yhteystiedot/i }));
      const { queryByText } = within(screen.getByRole('tabpanel', { name: /yhteystiedot/i }));

      expect(queryByText('Päätös tilattu paperisena')).not.toBeInTheDocument();
    });
  });
});

describe('Excavation notification application view', () => {
  test('Shows last completion date', async () => {
    render(<ApplicationViewContainer id={10} />);
    await waitForLoadingToFinish();

    expect(
      screen.getByText('Ilmoitettu valmiiksi 1.8.2024 18:15 päivämäärälle 1.8.2024'),
    ).toBeInTheDocument();
  });

  test('Shows decision links if decisions are available', async () => {
    render(<ApplicationViewContainer id={10} />);
    await waitForLoadingToFinish();

    expect(screen.getByText('Lataa päätös (PDF)')).toBeInTheDocument();
    expect(screen.getByText('Lataa toiminnallinen kunto (PDF)')).toBeInTheDocument();
    expect(screen.getByText('Lataa työ valmis (PDF)')).toBeInTheDocument();
  });

  test('Shows correct information in areas tab', async () => {
    const { user } = render(<ApplicationViewContainer id={5} />);
    await waitForLoadingToFinish();
    await user.click(screen.getByRole('tab', { name: /alueet/i }));
    const { queryByText } = within(screen.getByRole('tabpanel', { name: /alueet/i }));

    expect(queryByText('12.1.2023')).toBeInTheDocument();
    expect(queryByText('12.11.2024')).toBeInTheDocument();
    expect(queryByText('Aidasmäentie 5')).toBeInTheDocument();
    expect(queryByText('Vesi, Viemäri')).toBeInTheDocument();
    expect(queryByText('Työalue 1')).toBeInTheDocument();
    expect(queryByText('Pinta-ala: 158 m²')).toBeInTheDocument();
    expect(queryByText('Työalue 2')).toBeInTheDocument();
    expect(queryByText('Pinta-ala: 30 m²')).toBeInTheDocument();
    expect(queryByText('188 m²')).toBeInTheDocument();
    expect(screen.getByTestId('test-pyoraliikenneindeksi')).toHaveTextContent('3');
    expect(screen.getByTestId('test-autoliikenneindeksi')).toHaveTextContent('3');
    expect(screen.getByTestId('test-linjaautoliikenneindeksi')).toHaveTextContent('4');
    expect(screen.getByTestId('test-raitioliikenneindeksi')).toHaveTextContent('5');
    expect(queryByText('Toistuva meluhaitta')).toBeInTheDocument();
    expect(queryByText('Jatkuva pölyhaitta')).toBeInTheDocument();
    expect(queryByText('Satunnainen tärinähaitta')).toBeInTheDocument();
    expect(queryByText('Vähentää kaistan yhdellä ajosuunnalla')).toBeInTheDocument();
    expect(queryByText('10-99 m')).toBeInTheDocument();
  });

  test('Shows correct information in sidebar', async () => {
    render(<ApplicationViewContainer id={5} />);
    await waitForLoadingToFinish();
    const sidebar = screen.getByTestId('application-view-sidebar');

    expect(sidebar).toMatchSnapshot();
  });

  describe('Report excavation notification in operational condition', () => {
    const setup = async (id: number = 8) => {
      const { user } = render(<ApplicationViewContainer id={id} />);
      await waitForLoadingToFinish();
      return user;
    };

    const validDate = '28.8.2024';

    const tomorrow = () => {
      const date = new Date();
      date.setDate(date.getDate() + 1);
      return format(date, 'd.M.yyyy', { locale: fi });
    };

    const dayBeforeStartDate = () => {
      const date = new Date(2023, 0, 11);
      return format(date, 'd.M.yyyy', { locale: fi });
    };

    describe('Report in operational condition button', () => {
      test('Shows the button when application can be reported being in operational condition', async () => {
        await setup();
        const button = await screen.findByRole('button', {
          name: 'Ilmoita toiminnalliseen kuntoon',
        });
        expect(button).toBeEnabled();
      });

      test('Does not show the button when application cannot be reported being in operational condition', async () => {
        await setup(7);
        expect(
          screen.queryByRole('button', { name: 'Ilmoita toiminnalliseen kuntoon' }),
        ).not.toBeInTheDocument();
      });
    });

    describe('Report in operational condition confirmation dialog', () => {
      afterEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
      });

      test('Shows previous operational condition reports in confirmation dialog', async () => {
        const user = await setup();

        const button = await screen.findByRole('button', {
          name: 'Ilmoita toiminnalliseen kuntoon',
        });
        await user.click(button);

        // confirmation dialog should be shown
        expect(await screen.findByText('Ilmoita toiminnalliseen kuntoon?')).toBeInTheDocument();
        expect(
          screen.getByText('Työ on aiemmin ilmoitettu toiminnalliseen kuntoon seuraavasti', {
            exact: false,
          }),
        ).toBeInTheDocument();
        const reportedDate = new Date('2024-08-01T15:15:00.000Z');
        expect(
          screen.getByText(`1.8.2024 ${format(reportedDate, 'HH:mm')} päivämäärälle 1.8.2024`),
        ).toBeInTheDocument();
      });

      test('Confirm button is disabled until a valid date is entered', async () => {
        const user = await setup();

        const button = await screen.findByRole('button', {
          name: 'Ilmoita toiminnalliseen kuntoon',
        });
        await user.click(button);

        // confirmation dialog should be shown
        expect(await screen.findByText('Ilmoita toiminnalliseen kuntoon?')).toBeInTheDocument();
        // confirmation button should be disabled until a valid date is entered
        const confirmButton = screen.getByRole('button', { name: 'Vahvista' });
        expect(confirmButton).toBeDisabled();
        const dateInput = screen.getByRole('textbox', { name: /päivämäärä/i });
        await user.type(dateInput, validDate);
        await user.tab();
        expect(confirmButton).toBeEnabled();
      });

      test('Does not accept a date in the future', async () => {
        const user = await setup();

        const button = await screen.findByRole('button', {
          name: 'Ilmoita toiminnalliseen kuntoon',
        });
        await user.click(button);
        expect(await screen.findByText('Ilmoita toiminnalliseen kuntoon?')).toBeInTheDocument();

        const date = tomorrow();
        const dateInput = screen.getByRole('textbox', { name: /päivämäärä/i });
        await user.type(dateInput, date);
        await user.tab();

        // validation error should be shown
        expect(
          await screen.findByText('Päivämäärä ei voi olla tulevaisuudessa'),
        ).toBeInTheDocument();
        // confirmation button should be disabled
        expect(screen.getByRole('button', { name: 'Vahvista' })).toBeDisabled();
      });

      test('Does not accept a date in before start date', async () => {
        const user = await setup();

        const button = await screen.findByRole('button', {
          name: 'Ilmoita toiminnalliseen kuntoon',
        });
        await user.click(button);
        expect(await screen.findByText('Ilmoita toiminnalliseen kuntoon?')).toBeInTheDocument();

        const date = dayBeforeStartDate();
        const dateInput = screen.getByRole('textbox', { name: /päivämäärä/i });
        await user.type(dateInput, date);
        await user.tab();

        // validation error should be shown
        expect(
          await screen.findByText(
            'Päivämäärä ei voi olla ennen hakemuksen töiden alkamispäivää (12.1.2023)',
          ),
        ).toBeInTheDocument();
        // confirmation button should be disabled
        expect(screen.getByRole('button', { name: 'Vahvista' })).toBeDisabled();
      });

      test('Confirms the report', async () => {
        const sendApplication = jest.spyOn(applicationApi, 'reportOperationalCondition');
        const user = await setup();

        const button = await screen.findByRole('button', {
          name: 'Ilmoita toiminnalliseen kuntoon',
        });
        await user.click(button);

        expect(await screen.findByText('Ilmoita toiminnalliseen kuntoon?')).toBeInTheDocument();
        const dateInput = screen.getByRole('textbox', { name: /päivämäärä/i });
        await user.type(dateInput, validDate);
        await user.tab();
        const confirmButton = screen.getByRole('button', { name: 'Vahvista' });
        await user.click(confirmButton);

        expect(await screen.findByText('Ilmoitus lähetetty')).toBeInTheDocument();
        expect(sendApplication).toHaveBeenCalledTimes(1);
        const reportedDate = sendApplication.mock.lastCall?.[0].date as Date;
        expect(format(reportedDate, 'd.M.yyyy')).toBe(validDate);
      });

      test('Cancels the report', async () => {
        const user = await setup();

        const button = await screen.findByRole('button', {
          name: 'Ilmoita toiminnalliseen kuntoon',
        });
        await user.click(button);

        expect(await screen.findByText('Ilmoita toiminnalliseen kuntoon?')).toBeInTheDocument();
        const cancelButton = screen.getByRole('button', { name: 'Peruuta' });
        await user.click(cancelButton);

        // confirmation dialog should be closed
        expect(screen.queryByText('Ilmoita toiminnalliseen kuntoon?')).not.toBeInTheDocument();
      });

      test('Shows error message if confirmation fails', async () => {
        server.use(
          http.post('/api/hakemukset/:id/toiminnallinen-kunto', async () => {
            await delay(200);
            return new HttpResponse(null, { status: 500 });
          }),
        );
        const user = await setup();
        const button = await screen.findByRole('button', {
          name: 'Ilmoita toiminnalliseen kuntoon',
        });
        await user.click(button);

        const dateInput = screen.getByRole('textbox', { name: /päivämäärä/i });
        await user.type(dateInput, validDate);
        await user.tab();

        const confirmButton = screen.getByRole('button', { name: 'Vahvista' });
        await user.click(confirmButton);

        expect(await screen.findByText('Ilmoituksen lähettäminen epäonnistui')).toBeInTheDocument();
        expect(screen.queryByText('Ilmoitus lähetetty')).not.toBeInTheDocument();
      });
    });
  });

  describe('Report excavation notification work finished', () => {
    const setup = async (id: number = 8) => {
      const { user } = render(<ApplicationViewContainer id={id} />);
      await waitForLoadingToFinish();
      return user;
    };

    const validDate = '28.8.2024';

    const tomorrow = () => {
      const date = new Date();
      date.setDate(date.getDate() + 1);
      return format(date, 'd.M.yyyy', { locale: fi });
    };

    const dayBeforeStartDate = () => {
      const date = new Date(2023, 0, 11);
      return format(date, 'd.M.yyyy', { locale: fi });
    };

    describe('Report finisehd button', () => {
      test('Shows the button when work can be reported being finished', async () => {
        await setup();
        screen.debug(undefined, 100000);
        const button = await screen.findByRole('button', {
          name: 'Ilmoita valmiiksi',
        });
        expect(button).toBeEnabled();
      });

      test('Does not show the button when work cannot be reported finished', async () => {
        await setup(7);
        expect(screen.queryByRole('button', { name: 'Ilmoita valmiiksi' })).not.toBeInTheDocument();
      });
    });

    describe('Report work finished confirmation dialog', () => {
      afterEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
      });

      test('Shows previous work finished reports in confirmation dialog', async () => {
        const user = await setup();

        const button = await screen.findByRole('button', {
          name: 'Ilmoita valmiiksi',
        });
        await user.click(button);

        // confirmation dialog should be shown
        expect(await screen.findByText('Ilmoita valmiiksi?')).toBeInTheDocument();
        expect(
          screen.getByText('Työ on aiemmin ilmoitettu valmiiksi seuraavasti', {
            exact: false,
          }),
        ).toBeInTheDocument();
        const reportedDate = new Date('2024-08-01T15:15:00.000Z');
        expect(
          screen.getByText(`1.8.2024 ${format(reportedDate, 'HH:mm')} päivämäärälle 1.8.2024`),
        ).toBeInTheDocument();
      });

      test('Confirm button is disabled until a valid date is entered', async () => {
        const user = await setup();

        const button = await screen.findByRole('button', {
          name: 'Ilmoita valmiiksi',
        });
        await user.click(button);

        // confirmation dialog should be shown
        expect(await screen.findByText('Ilmoita valmiiksi?')).toBeInTheDocument();
        // confirmation button should be disabled until a valid date is entered
        const confirmButton = screen.getByRole('button', { name: 'Vahvista' });
        expect(confirmButton).toBeDisabled();
        const dateInput = screen.getByRole('textbox', { name: /päivämäärä/i });
        await user.type(dateInput, validDate);
        await user.tab();
        expect(confirmButton).toBeEnabled();
      });

      test('Does not accept a date in the future', async () => {
        const user = await setup();

        const button = await screen.findByRole('button', {
          name: 'Ilmoita valmiiksi',
        });
        await user.click(button);
        expect(await screen.findByText('Ilmoita valmiiksi?')).toBeInTheDocument();

        const date = tomorrow();
        const dateInput = screen.getByRole('textbox', { name: /päivämäärä/i });
        await user.type(dateInput, date);
        await user.tab();

        // validation error should be shown
        expect(
          await screen.findByText('Päivämäärä ei voi olla tulevaisuudessa'),
        ).toBeInTheDocument();
        // confirmation button should be disabled
        expect(screen.getByRole('button', { name: 'Vahvista' })).toBeDisabled();
      });

      test('Does not accept a date in before start date', async () => {
        const user = await setup();

        const button = await screen.findByRole('button', {
          name: 'Ilmoita valmiiksi',
        });
        await user.click(button);
        expect(await screen.findByText('Ilmoita valmiiksi?')).toBeInTheDocument();

        const date = dayBeforeStartDate();
        const dateInput = screen.getByRole('textbox', { name: /päivämäärä/i });
        await user.type(dateInput, date);
        await user.tab();

        // validation error should be shown
        expect(
          await screen.findByText(
            'Päivämäärä ei voi olla ennen hakemuksen töiden alkamispäivää (12.1.2023)',
          ),
        ).toBeInTheDocument();
        // confirmation button should be disabled
        expect(screen.getByRole('button', { name: 'Vahvista' })).toBeDisabled();
      });

      test('Confirms the report', async () => {
        const sendApplication = jest.spyOn(applicationApi, 'reportWorkFinished');
        const user = await setup();

        const button = await screen.findByRole('button', {
          name: 'Ilmoita valmiiksi',
        });
        await user.click(button);

        expect(await screen.findByText('Ilmoita valmiiksi?')).toBeInTheDocument();
        const dateInput = screen.getByRole('textbox', { name: /päivämäärä/i });
        await user.type(dateInput, validDate);
        await user.tab();
        const confirmButton = screen.getByRole('button', { name: 'Vahvista' });
        await user.click(confirmButton);

        expect(await screen.findByText('Ilmoitus lähetetty')).toBeInTheDocument();
        expect(sendApplication).toHaveBeenCalledTimes(1);
        const reportedDate = sendApplication.mock.lastCall?.[0].date as Date;
        expect(format(reportedDate, 'd.M.yyyy')).toBe(validDate);
      });

      test('Cancels the report', async () => {
        const user = await setup();

        const button = await screen.findByRole('button', {
          name: 'Ilmoita valmiiksi',
        });
        await user.click(button);

        expect(await screen.findByText('Ilmoita valmiiksi?')).toBeInTheDocument();
        const cancelButton = screen.getByRole('button', { name: 'Peruuta' });
        await user.click(cancelButton);

        // confirmation dialog should be closed
        expect(screen.queryByText('Ilmoita valmiiksi?')).not.toBeInTheDocument();
      });

      test('Shows error message if confirmation fails', async () => {
        server.use(
          http.post('/api/hakemukset/:id/tyo-valmis', async () => {
            await delay(200);
            return new HttpResponse(null, { status: 500 });
          }),
        );
        const user = await setup();
        const button = await screen.findByRole('button', {
          name: 'Ilmoita valmiiksi',
        });
        await user.click(button);

        const dateInput = screen.getByRole('textbox', { name: /päivämäärä/i });
        await user.type(dateInput, validDate);
        await user.tab();

        const confirmButton = screen.getByRole('button', { name: 'Vahvista' });
        await user.click(confirmButton);

        expect(await screen.findByText('Ilmoituksen lähettäminen epäonnistui')).toBeInTheDocument();
        expect(screen.queryByText('Ilmoitus lähetetty')).not.toBeInTheDocument();
      });
    });
  });

  describe('Contacts', () => {
    test('Shows paper decision contact information when there is data', async () => {
      const { user } = render(<ApplicationViewContainer id={8} />);
      await waitForLoadingToFinish();
      await user.click(screen.getByRole('tab', { name: /yhteystiedot/i }));
      const { getByText } = within(screen.getByRole('tabpanel', { name: /yhteystiedot/i }));

      expect(getByText('Päätös tilattu paperisena')).toBeInTheDocument();
      expect(getByText('Pekka Paperinen')).toBeInTheDocument();
      expect(getByText('Paperipolku 3 A 4')).toBeInTheDocument();
      expect(getByText('00451 Helsinki')).toBeInTheDocument();
    });

    test('Does not show paper decision contact information when there is no data', async () => {
      const { user } = render(<ApplicationViewContainer id={7} />);
      await waitForLoadingToFinish();
      await user.click(screen.getByRole('tab', { name: /yhteystiedot/i }));
      const { queryByText } = within(screen.getByRole('tabpanel', { name: /yhteystiedot/i }));

      expect(queryByText('Päätös tilattu paperisena')).not.toBeInTheDocument();
    });
  });
});
