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
import { Application, JohtoselvitysData, KaivuilmoitusData } from '../types/application';
import * as taydennysApi from '../taydennys/taydennysApi';
import { USER_VIEW } from '../../mocks/signedInUser';
import { createTaydennysAttachments } from '../../mocks/attachments';
import * as muutosilmoitusApi from '../muutosilmoitus/muutosilmoitusApi';
import { HAITTA_INDEX_TYPE } from '../../common/haittaIndexes/types';

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

  test('Does not show create muutosilmoitus button for johtoselvitys', async () => {
    render(<ApplicationViewContainer id={9} />);
    await waitForLoadingToFinish();

    expect(screen.queryByRole('button', { name: 'Tee muutosilmoitus' })).not.toBeInTheDocument();
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

  describe('Taydennyspyynto', () => {
    test('Shows taydennyspyynto notification if there is a taydennyspyynto', async () => {
      render(<ApplicationViewContainer id={11} />);
      await waitForLoadingToFinish();

      expect(screen.getByRole('heading', { name: 'Täydennyspyyntö' })).toBeInTheDocument();
      expect(
        screen.getByText('Muokkaa hakemusta korjataksesi seuraavat asiat:'),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          (_, element) =>
            element?.textContent === 'Rakennuttajan tiedot: Virheellinen sähköpostiosoite',
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          (_, element) =>
            element?.textContent === 'Työn arvioitu alkupäivä: Korjaa aloituspäivämäärää',
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          (_, element) =>
            element?.textContent === 'Työn arvioitu loppupäivä: Korjaa lopetuspäivämäärää',
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          (_, element) => element?.textContent === 'Työn kuvaus: Tarkenna työn kuvausta',
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          (_, element) => element?.textContent === 'Työalueet: Korjaa karttarajausta',
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          (_, element) =>
            element?.textContent ===
            'Liitteet: Liikennejärjestelysuunnitelma ja valtakirja työstä vastaavalta puuttuu',
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          (_, element) => element?.textContent === 'Muu: Korjaa myös liikennejärjestelytekstiä',
        ),
      ).toBeInTheDocument();
    });

    test('Does not show taydennyspyynto notification if there is no taydennyspyynto', async () => {
      render(<ApplicationViewContainer id={1} />);
      await waitForLoadingToFinish();

      expect(screen.queryByRole('heading', { name: 'Täydennyspyyntö' })).not.toBeInTheDocument();
    });

    test('Does not show taydennyspyynto notification if feature is not enabled', async () => {
      const OLD_ENV = { ...window._env_ };
      window._env_ = { ...OLD_ENV, REACT_APP_FEATURE_INFORMATION_REQUEST: 0 };
      render(<ApplicationViewContainer id={11} />);
      await waitForLoadingToFinish();

      expect(screen.queryByRole('heading', { name: 'Täydennyspyyntö' })).not.toBeInTheDocument();

      jest.resetModules();
      window._env_ = OLD_ENV;
    });
  });

  describe('Taydennys', () => {
    async function setup(application: Application<JohtoselvitysData>) {
      server.use(
        http.get('/api/hakemukset/:id', async () => {
          return HttpResponse.json<Application<JohtoselvitysData>>(application);
        }),
        http.post('/api/taydennykset/:id/laheta', async () => {
          return HttpResponse.json(application);
        }),
        http.delete('/api/taydennykset/:id', async () => {
          return new HttpResponse();
        }),
      );
      const renderResult = render(<ApplicationViewContainer id={application.id!} />);
      await waitForLoadingToFinish();
      return renderResult;
    }

    test('Does not show create taydennys button if the feature is disabled', async () => {
      const OLD_ENV = { ...window._env_ };
      window._env_ = { ...OLD_ENV, REACT_APP_FEATURE_INFORMATION_REQUEST: 0 };
      const application = cloneDeep(hakemukset[10]) as Application<JohtoselvitysData>;
      await setup(application);

      expect(screen.queryByRole('button', { name: 'Täydennä' })).not.toBeInTheDocument();

      jest.resetModules();
      window._env_ = OLD_ENV;
    });

    test('Does not show edit taydennys button if the feature is disabled', async () => {
      const OLD_ENV = { ...window._env_ };
      window._env_ = { ...OLD_ENV, REACT_APP_FEATURE_INFORMATION_REQUEST: 0 };
      const application = cloneDeep(hakemukset[10]) as Application<JohtoselvitysData>;
      application.taydennys = {
        id: 'c0a1fe7b-326c-4b25-a7bc-d1797762c01c',
        applicationData: application.applicationData,
        muutokset: [],
        liitteet: [],
      };
      await setup(application);

      expect(
        screen.queryByRole('button', { name: 'Muokkaa hakemusta (täydennys)' }),
      ).not.toBeInTheDocument();

      jest.resetModules();
      window._env_ = OLD_ENV;
    });

    test('Creates taydennys and navigates to edit taydennys path if taydennys does not exist', async () => {
      const taydennysCreateSpy = jest.spyOn(taydennysApi, 'createTaydennys');
      const application = hakemukset[10] as Application<JohtoselvitysData>;
      server.use(
        http.post('/api/hakemukset/:id/taydennys', async () => {
          return HttpResponse.json(
            {
              id: 'c0a1fe7b-326c-4b25-a7bc-d1797762c01c',
              applicationData: application.applicationData,
            },
            { status: 200 },
          );
        }),
      );
      const { user } = await setup(application);
      await user.click(screen.getByRole('button', { name: 'Täydennä' }));

      expect(window.location.pathname).toBe(`/fi/johtoselvitystaydennys/${application.id}/muokkaa`);
      expect(taydennysCreateSpy).toHaveBeenCalledWith(application.id);
      taydennysCreateSpy.mockRestore();
    });

    test('Navigates to edit taydennys path if taydennys exists', async () => {
      const application = cloneDeep(hakemukset[10]) as Application<JohtoselvitysData>;
      application.taydennys = {
        id: 'c0a1fe7b-326c-4b25-a7bc-d1797762c01c',
        applicationData: application.applicationData,
        muutokset: [],
        liitteet: [],
      };
      const { user } = await setup(application);
      await user.click(screen.getByRole('button', { name: 'Muokkaa hakemusta (täydennys)' }));

      expect(window.location.pathname).toBe(`/fi/johtoselvitystaydennys/${application.id}/muokkaa`);
    });

    test('Shows error notification if creating taydennys fails', async () => {
      server.use(
        http.post('/api/hakemukset/:id/taydennys', async () => {
          return HttpResponse.json(
            { errorMessage: 'Failed for testing purposes' },
            { status: 500 },
          );
        }),
      );
      const application = hakemukset[10] as Application<JohtoselvitysData>;
      const { user } = await setup(application);
      await user.click(screen.getByRole('button', { name: 'Täydennä' }));

      expect(await screen.findByText('Tapahtui virhe. Yritä uudestaan.')).toBeInTheDocument();
    });

    test('Shows changed information in basic information tab', async () => {
      const application = cloneDeep(hakemukset[10] as Application<JohtoselvitysData>);
      const name = 'New name';
      const postalAddress = {
        streetAddress: {
          streetName: 'New street',
        },
      };
      const workDescription = 'New work description';
      application.taydennys = {
        id: 'c0a1fe7b-326c-4b25-a7bc-d1797762c01c',
        applicationData: {
          ...application.applicationData,
          name,
          postalAddress,
          workDescription,
          constructionWork: false,
          propertyConnectivity: true,
          emergencyWork: true,
          rockExcavation: false,
          areas: [
            ...application.applicationData.areas,
            {
              name: '',
              geometry: {
                type: 'Polygon',
                crs: {
                  type: 'name',
                  properties: {
                    name: 'urn:ogc:def:crs:EPSG::3879',
                  },
                },
                coordinates: [
                  [
                    [25498581.440262634, 6679345.526261961],
                    [25498582.233686976, 6679350.99321805],
                    [25498576.766730886, 6679351.786642391],
                    [25498575.973306544, 6679346.319686302],
                    [25498581.440262634, 6679345.526261961],
                  ],
                ],
              },
            },
          ],
        },
        muutokset: [
          'name',
          'postalAddress',
          'constructionWork',
          'propertyConnectivity',
          'emergencyWork',
          'rockExcavation',
          'workDescription',
        ],
        liitteet: [],
      };
      await setup(application);

      expect(screen.getAllByText('Täydennys:').length).toBe(6);
      expect(screen.getAllByText('Poistettu:').length).toBe(1);
      expect(screen.getByText(name)).toBeInTheDocument();
      expect(screen.getByText(postalAddress.streetAddress.streetName)).toBeInTheDocument();
      expect(screen.getByText(workDescription)).toBeInTheDocument();
      expect(screen.getByText('Olemassaolevan rakenteen kunnossapitotyöstä')).toBeInTheDocument();
      expect(screen.getByText('Kiinteistöliittymien rakentamisesta')).toBeInTheDocument();
      expect(screen.getAllByText('Uuden rakenteen tai johdon rakentamisesta').length).toBe(2);
      expect(
        screen.getByText(
          'Kaivutyö on aloitettu ennen johtoselvityksen tilaamista merkittävien vahinkojen välttämiseksi',
        ),
      ).toBeInTheDocument();
      expect(screen.getByText('Ei')).toBeInTheDocument();
      expect(screen.getByText('266 m²')).toBeInTheDocument();
    });

    test('Shows changed information in areas tab', async () => {
      const application = cloneDeep(hakemukset[10] as Application<JohtoselvitysData>);
      application.applicationData.areas = [
        ...application.applicationData.areas,
        {
          name: '',
          geometry: {
            type: 'Polygon',
            crs: {
              type: 'name',
              properties: {
                name: 'urn:ogc:def:crs:EPSG::3879',
              },
            },
            coordinates: [
              [
                [25498581.440262634, 6679345.526261961],
                [25498582.233686976, 6679350.99321805],
                [25498576.766730886, 6679351.786642391],
                [25498575.973306544, 6679346.319686302],
                [25498581.440262634, 6679345.526261961],
              ],
            ],
          },
        },
        {
          name: '',
          geometry: {
            type: 'Polygon',
            crs: {
              type: 'name',
              properties: {
                name: 'urn:ogc:def:crs:EPSG::3879',
              },
            },
            coordinates: [
              [
                [25498581.440262634, 6679345.526261961],
                [25498582.233686976, 6679350.99321805],
                [25498576.766730886, 6679351.786642391],
                [25498575.973306544, 6679346.319686302],
                [25498581.440262634, 6679345.526261961],
              ],
            ],
          },
        },
      ];
      application.taydennys = {
        id: 'c0a1fe7b-326c-4b25-a7bc-d1797762c01c',
        applicationData: {
          ...application.applicationData,
          areas: [
            ...application.applicationData.areas.slice(0, 1),
            {
              name: '',
              geometry: {
                type: 'Polygon',
                crs: {
                  type: 'name',
                  properties: {
                    name: 'urn:ogc:def:crs:EPSG::3879',
                  },
                },
                coordinates: [
                  [
                    [25498581.440262634, 6679345.526261961],
                    [25498582.233686976, 6679350.99321805],
                    [25498576.766730886, 6679351.786642391],
                    [25498575.973306544, 6679346.319686302],
                    [25498581.440262634, 6679345.526261961],
                  ],
                ],
              },
            },
          ],
        },
        muutokset: ['areas[1]', 'areas[2]'],
        liitteet: [],
      };
      const { user } = await setup(application);
      await user.click(screen.getByRole('tab', { name: /alueet/i }));

      expect(screen.getAllByText('Täydennys:').length).toBe(2);
      expect(screen.getByText('266 m²')).toBeInTheDocument();
    });

    test('Shows changed information in contacts tab', async () => {
      const application = cloneDeep(hakemukset[10] as Application<JohtoselvitysData>);
      application.applicationData.propertyDeveloperWithContacts = cloneDeep(
        application.applicationData.customerWithContacts,
      );
      application.taydennys = {
        id: 'c0a1fe7b-326c-4b25-a7bc-d1797762c01c',
        applicationData: {
          ...application.applicationData,
          customerWithContacts: {
            customer: {
              ...application.applicationData.customerWithContacts!.customer,
              name: 'New name',
              email: 'newMail@test.com',
            },
            contacts: application.applicationData.customerWithContacts!.contacts,
          },
          propertyDeveloperWithContacts: null,
        },
        muutokset: ['customerWithContacts', 'propertyDeveloperWithContacts'],
        liitteet: [],
      };
      const { user } = await setup(application);
      await user.click(screen.getByRole('tab', { name: /yhteystiedot/i }));

      expect(screen.getAllByText('Täydennys:').length).toBe(1);
      expect(screen.getAllByText('Poistettu:').length).toBe(1);
      expect(screen.getByText('New name')).toBeInTheDocument();
      expect(screen.getByText('newMail@test.com')).toBeInTheDocument();
    });

    test('Shows changed information in attachments tab', async () => {
      const taydennysId = 'c0a1fe7b-326c-4b25-a7bc-d1797762c01c';
      const taydennysAttachments = createTaydennysAttachments(taydennysId, [
        { attachmentType: 'MUU' },
        { attachmentType: 'MUU' },
      ]);
      const application = cloneDeep(hakemukset[10] as Application<JohtoselvitysData>);
      application.taydennys = {
        id: taydennysId,
        applicationData: application.applicationData,
        muutokset: [],
        liitteet: taydennysAttachments,
      };
      const { user } = await setup(application);
      await user.click(screen.getByRole('tab', { name: /liitteet/i }));

      expect(screen.getByText('Täydennys:')).toBeInTheDocument();
      taydennysAttachments.forEach((attachment) => {
        expect(screen.getByText(attachment.fileName)).toBeInTheDocument();
      });
    });

    test('Taydennys can be sent', async () => {
      const application = cloneDeep(hakemukset[10]) as Application<JohtoselvitysData>;
      application.taydennys = {
        id: 'c0a1fe7b-326c-4b25-a7bc-d1797762c01c',
        applicationData: application.applicationData,
        muutokset: ['workDescription'],
        liitteet: [],
      };
      const { user } = await setup(application);
      await user.click(screen.getByRole('button', { name: 'Lähetä täydennys' }));
      await user.click(await screen.findByRole('button', { name: /vahvista/i }));

      expect(await screen.findByText(/täydennys lähetetty/i)).toBeInTheDocument();
    });

    test('Send taydennys button is not visible if there are no changes', async () => {
      const application = cloneDeep(hakemukset[10]) as Application<JohtoselvitysData>;
      application.taydennys = {
        id: 'c0a1fe7b-326c-4b25-a7bc-d1797762c01c',
        applicationData: application.applicationData,
        muutokset: [],
        liitteet: [],
      };
      await setup(application);

      expect(screen.queryByRole('button', { name: 'Lähetä täydennys' })).not.toBeInTheDocument();
    });

    test('Send taydennys button is not visible if user does not have permission', async () => {
      server.use(
        http.get('/api/hankkeet/:hankeTunnus/whoami', async () => {
          return HttpResponse.json<SignedInUser>(USER_VIEW);
        }),
      );
      const application = cloneDeep(hakemukset[10]) as Application<JohtoselvitysData>;
      application.taydennys = {
        id: 'c0a1fe7b-326c-4b25-a7bc-d1797762c01c',
        applicationData: application.applicationData,
        muutokset: ['workDescription'],
        liitteet: [],
      };
      await setup(application);

      expect(screen.queryByRole('button', { name: 'Lähetä täydennys' })).not.toBeInTheDocument();
    });

    test('Should be able to cancel taydennys', async () => {
      const application = cloneDeep(hakemukset[10]) as Application<JohtoselvitysData>;
      application.taydennys = {
        id: 'c0a1fe7b-326c-4b25-a7bc-d1797762c01c',
        applicationData: application.applicationData,
        muutokset: ['workDescription'],
        liitteet: [],
      };
      const { user } = await setup(application);
      await user.click(screen.getByRole('button', { name: 'Peru täydennysluonnos' }));
      await user.click(await screen.findByRole('button', { name: /vahvista/i }));

      expect(await screen.findByText('Täydennysluonnos peruttiin')).toBeInTheDocument();
      expect(screen.getByText('Täydennysluonnos peruttiin onnistuneesti')).toBeInTheDocument();
    });

    test('Cancel taydennys button is not visible if taydennys field is null', async () => {
      const application = cloneDeep(hakemukset[10]) as Application<JohtoselvitysData>;
      application.taydennys = null;
      await setup(application);

      expect(
        screen.queryByRole('button', { name: 'Peru täydennysluonnos' }),
      ).not.toBeInTheDocument();
    });

    test('Cancel taydennys button is not visible if user does not have permission', async () => {
      server.use(
        http.get('/api/hankkeet/:hankeTunnus/whoami', async () => {
          return HttpResponse.json<SignedInUser>(USER_VIEW);
        }),
      );
      const application = cloneDeep(hakemukset[10]) as Application<JohtoselvitysData>;
      application.taydennys = {
        id: 'c0a1fe7b-326c-4b25-a7bc-d1797762c01c',
        applicationData: application.applicationData,
        muutokset: ['workDescription'],
        liitteet: [],
      };
      await setup(application);

      expect(
        screen.queryByRole('button', { name: 'Peru täydennysluonnos' }),
      ).not.toBeInTheDocument();
    });
  });
});

describe('Excavation notification application view', () => {
  test('Shows last completion date for operational condition', async () => {
    render(<ApplicationViewContainer id={12} />);
    await waitForLoadingToFinish();

    const reportedDate = new Date('2024-08-01T15:15:00.000Z');
    expect(
      screen.getByText(
        `Ilmoitettu toiminnalliseen kuntoon 1.8.2024 ${format(reportedDate, 'HH:mm')} päivämäärälle 1.8.2024`,
      ),
    ).toBeInTheDocument();
  });

  test('Shows last completion date for work finished', async () => {
    render(<ApplicationViewContainer id={10} />);
    await waitForLoadingToFinish();

    const reportedDate = new Date('2024-08-02T15:15:00.000Z');
    expect(
      screen.getByText(
        `Ilmoitettu valmiiksi 2.8.2024 ${format(reportedDate, 'HH:mm')} päivämäärälle 2.8.2024`,
      ),
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
    expect(queryByText('Pinta-ala: 159 m²')).toBeInTheDocument();
    expect(queryByText('Työalue 2')).toBeInTheDocument();
    expect(queryByText('Pinta-ala: 31 m²')).toBeInTheDocument();
    expect(queryByText('190 m²')).toBeInTheDocument();
    expect(screen.getByTestId('test-pyoraliikenneindeksi')).toHaveTextContent('3');
    expect(screen.getByTestId('test-autoliikenneindeksi')).toHaveTextContent('3');
    expect(screen.getByTestId('test-linjaautoliikenneindeksi')).toHaveTextContent('0');
    expect(screen.getByTestId('test-raitioliikenneindeksi')).toHaveTextContent('5');
    expect(queryByText('Toistuva meluhaitta')).toBeInTheDocument();
    expect(queryByText('Jatkuva pölyhaitta')).toBeInTheDocument();
    expect(queryByText('Satunnainen tärinähaitta')).toBeInTheDocument();
    expect(queryByText('Yksi autokaista vähenee - ajosuunta vielä käytössä')).toBeInTheDocument();
    expect(queryByText('10-99 m')).toBeInTheDocument();
  });

  test('Shows correct information in nuisance management tab', async () => {
    const { user } = render(<ApplicationViewContainer id={5} />);
    await waitForLoadingToFinish();
    await user.click(screen.getByRole('tab', { name: /haittojen hallinta/i }));
    const { queryByText } = within(screen.getByRole('tabpanel', { name: /haittojen hallinta/i }));

    expect(queryByText('Työalueen yleisten haittojen hallintasuunnitelma')).toBeInTheDocument();
    expect(
      queryByText('Raitioliikenteelle koituvien työalueen haittojen hallintasuunnitelma'),
    ).toBeInTheDocument();
    expect(
      queryByText('Pyöräliikenteelle koituvien työalueen haittojen hallintasuunnitelma'),
    ).toBeInTheDocument();
    expect(
      queryByText('Autoliikenteelle koituvien työalueen haittojen hallintasuunnitelma'),
    ).toBeInTheDocument();
    expect(queryByText('Muiden työalueen haittojen hallintasuunnitelma')).toBeInTheDocument();
    expect(screen.getByTestId('test-RAITIOLIIKENNE')).toHaveTextContent('5');
    expect(screen.getByTestId('test-PYORALIIKENNE')).toHaveTextContent('3');
    expect(screen.getByTestId('test-AUTOLIIKENNE')).toHaveTextContent('3');
    expect(screen.getByTestId('test-LINJAAUTOLIIKENNE')).toHaveTextContent('0');
    expect(queryByText('Yleisten haittojen hallintasuunnitelma')).not.toBeVisible();
    expect(
      queryByText('Raitioliikenteelle koituvien haittojen hallintasuunnitelma'),
    ).not.toBeVisible();
    expect(
      queryByText('Pyöräliikenteelle koituvien haittojen hallintasuunnitelma'),
    ).not.toBeVisible();
    expect(
      queryByText('Autoliikenteelle koituvien haittojen hallintasuunnitelma'),
    ).not.toBeVisible();
    expect(
      queryByText('Linja-autoliikenteelle koituvien haittojen hallintasuunnitelma'),
    ).not.toBeVisible();
    expect(queryByText('Muiden haittojen hallintasuunnitelma')).not.toBeVisible();

    // open "hankealueen haittojen hallinta" accordions
    await user.click(screen.getAllByText('Hankealueen haittojen hallinta')[0]);
    expect(queryByText('Yleisten haittojen hallintasuunnitelma')).toBeVisible();
    await user.click(screen.getAllByText('Hankealueen haittojen hallinta')[1]);
    expect(queryByText('Raitioliikenteelle koituvien haittojen hallintasuunnitelma')).toBeVisible();
    await user.click(screen.getAllByText('Hankealueen haittojen hallinta')[2]);
    expect(queryByText('Pyöräliikenteelle koituvien haittojen hallintasuunnitelma')).toBeVisible();
    await user.click(screen.getAllByText('Hankealueen haittojen hallinta')[3]);
    expect(queryByText('Autoliikenteelle koituvien haittojen hallintasuunnitelma')).toBeVisible();
    await user.click(screen.getAllByText('Hankealueen haittojen hallinta')[4]);
    expect(
      queryByText('Linja-autoliikenteelle koituvien haittojen hallintasuunnitelma'),
    ).toBeVisible();
    await user.click(screen.getAllByText('Hankealueen haittojen hallinta')[5]);
    expect(queryByText('Muiden haittojen hallintasuunnitelma')).toBeVisible();
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

  describe('Taydennys', () => {
    async function setup(application: Application<KaivuilmoitusData>) {
      server.use(
        http.get('/api/hakemukset/:id', async () => {
          return HttpResponse.json<Application<KaivuilmoitusData>>(application);
        }),
        http.post('/api/taydennykset/:id/laheta', async () => {
          return HttpResponse.json(application);
        }),
        http.delete('/api/taydennykset/:id', async () => {
          return new HttpResponse();
        }),
      );
      const renderResult = render(<ApplicationViewContainer id={application.id!} />);
      await waitForLoadingToFinish();
      return renderResult;
    }

    test('Does not show create taydennys button if the feature is disabled', async () => {
      const OLD_ENV = { ...window._env_ };
      window._env_ = { ...OLD_ENV, REACT_APP_FEATURE_INFORMATION_REQUEST: 0 };
      const application = cloneDeep(hakemukset[12]) as Application<KaivuilmoitusData>;
      await setup(application);

      expect(screen.queryByRole('button', { name: 'Täydennä' })).not.toBeInTheDocument();

      jest.resetModules();
      window._env_ = OLD_ENV;
    });

    test('Does not show edit taydennys button if the feature is disabled', async () => {
      const OLD_ENV = { ...window._env_ };
      window._env_ = { ...OLD_ENV, REACT_APP_FEATURE_INFORMATION_REQUEST: 0 };
      const application = cloneDeep(hakemukset[12]) as Application<KaivuilmoitusData>;
      application.taydennys = {
        id: 'c0a1fe7b-326c-4b25-a7bc-d1797762c01d',
        applicationData: application.applicationData,
        muutokset: [],
        liitteet: [],
      };
      await setup(application);

      expect(
        screen.queryByRole('button', { name: 'Muokkaa hakemusta (täydennys)' }),
      ).not.toBeInTheDocument();

      jest.resetModules();
      window._env_ = OLD_ENV;
    });

    test('Creates taydennys and navigates to edit taydennys path if taydennys does not exist', async () => {
      const taydennysCreateSpy = jest.spyOn(taydennysApi, 'createTaydennys');
      const application = hakemukset[12] as Application<KaivuilmoitusData>;
      server.use(
        http.post('/api/hakemukset/:id/taydennys', async () => {
          return HttpResponse.json(
            {
              id: 'c0a1fe7b-326c-4b25-a7bc-d1797762c01d',
              applicationData: application.applicationData,
            },
            { status: 200 },
          );
        }),
      );
      const { user } = await setup(application);
      await user.click(screen.getByRole('button', { name: 'Täydennä' }));

      expect(window.location.pathname).toBe(`/fi/kaivuilmoitustaydennys/${application.id}/muokkaa`);
      expect(taydennysCreateSpy).toHaveBeenCalledWith(application.id);
      taydennysCreateSpy.mockRestore();
    });

    test('Navigates to edit taydennys path if taydennys exists', async () => {
      const application = cloneDeep(hakemukset[12]) as Application<KaivuilmoitusData>;
      application.taydennys = {
        id: 'c0a1fe7b-326c-4b25-a7bc-d1797762c01d',
        applicationData: application.applicationData,
        muutokset: [],
        liitteet: [],
      };
      const { user } = await setup(application);
      await user.click(screen.getByRole('button', { name: 'Muokkaa hakemusta (täydennys)' }));

      expect(window.location.pathname).toBe(`/fi/kaivuilmoitustaydennys/${application.id}/muokkaa`);
    });

    test('Shows error notification if creating taydennys fails', async () => {
      server.use(
        http.post('/api/hakemukset/:id/taydennys', async () => {
          return HttpResponse.json(
            { errorMessage: 'Failed for testing purposes' },
            { status: 500 },
          );
        }),
      );
      const application = hakemukset[12] as Application<KaivuilmoitusData>;
      const { user } = await setup(application);
      await user.click(screen.getByRole('button', { name: 'Täydennä' }));

      expect(await screen.findByText('Tapahtui virhe. Yritä uudestaan.')).toBeInTheDocument();
    });

    test('Shows changed information in basic information tab', async () => {
      const application = cloneDeep(hakemukset[12] as Application<KaivuilmoitusData>);
      const name = 'New name';
      const workDescription = 'New work description';
      application.taydennys = {
        id: 'c0a1fe7b-326c-4b25-a7bc-d1797762c01c',
        applicationData: {
          ...application.applicationData,
          name,
          workDescription,
          constructionWork: false,
          maintenanceWork: true,
          emergencyWork: true,
          cableReports: [...(application.applicationData.cableReports || []), 'JS2300003'],
          placementContracts: [
            ...(application.applicationData.placementContracts || []),
            'SL1234568',
          ],
          areas: [
            {
              ...application.applicationData.areas[0],
              tyoalueet: [
                ...application.applicationData.areas[0].tyoalueet,
                {
                  area: 10,
                  geometry: {
                    type: 'Polygon',
                    crs: {
                      type: 'name',
                      properties: {
                        name: 'urn:ogc:def:crs:EPSG::3879',
                      },
                    },
                    coordinates: [
                      [
                        [25498581.440262634, 6679345.526261961],
                        [25498582.233686976, 6679350.99321805],
                        [25498576.766730886, 6679351.786642391],
                        [25498575.973306544, 6679346.319686302],
                        [25498581.440262634, 6679345.526261961],
                      ],
                    ],
                  },
                },
              ],
            },
          ],
        },
        muutokset: [
          'name',
          'workDescription',
          'constructionWork',
          'maintenanceWork',
          'emergencyWork',
          'cableReports',
          'placementContracts',
        ],
        liitteet: [],
      };
      await setup(application);

      expect(screen.getAllByText('Täydennys:').length).toBe(6);
      expect(screen.getAllByText('Poistettu:').length).toBe(1);
      expect(screen.getByText(name)).toBeInTheDocument();
      expect(screen.getByText(workDescription)).toBeInTheDocument();
      expect(screen.getByText('Olemassaolevan rakenteen kunnossapitotyöstä')).toBeInTheDocument();
      expect(screen.getAllByText('Uuden rakenteen tai johdon rakentamisesta').length).toBe(2);
      expect(
        screen.getByText(
          'Kaivutyö on aloitettu ennen johtoselvityksen tilaamista merkittävien vahinkojen välttämiseksi',
        ),
      ).toBeInTheDocument();
      expect(screen.getByText('JS2300003')).toBeInTheDocument();
      expect(screen.getByText('SL1234568')).toBeInTheDocument();
      expect(screen.getByText('221 m²')).toBeInTheDocument();
    });

    test('Shows changed information in areas tab', async () => {
      const application = cloneDeep(hakemukset[12] as Application<KaivuilmoitusData>);
      application.taydennys = {
        id: 'c0a1fe7b-326c-4b25-a7bc-d1797762c01c',
        applicationData: {
          ...application.applicationData,
          areas: [
            {
              ...application.applicationData.areas[0],
              tyoalueet: [
                ...application.applicationData.areas[0].tyoalueet.slice(0, 1),
                {
                  area: 10,
                  geometry: {
                    type: 'Polygon',
                    crs: {
                      type: 'name',
                      properties: {
                        name: 'urn:ogc:def:crs:EPSG::3879',
                      },
                    },
                    coordinates: [
                      [
                        [25498574.56194478, 6679282.528783048],
                        [25498582.990384366, 6679282.528783048],
                        [25498582.990384366, 6679310.418567079],
                        [25498574.56194478, 6679310.418567079],
                        [25498574.56194478, 6679282.528783048],
                      ],
                    ],
                  },
                  tormaystarkasteluTulos: {
                    liikennehaittaindeksi: {
                      indeksi: 5,
                      tyyppi: HAITTA_INDEX_TYPE.AUTOLIIKENNEINDEKSI,
                    },
                    pyoraliikenneindeksi: 3,
                    autoliikenne: {
                      indeksi: 5,
                      haitanKesto: 5,
                      katuluokka: 5,
                      liikennemaara: 5,
                      kaistahaitta: 5,
                      kaistapituushaitta: 5,
                    },
                    linjaautoliikenneindeksi: 0,
                    raitioliikenneindeksi: 1,
                  },
                },
              ],
              tyonTarkoitukset: ['VESI', 'TIETOLIIKENNE'],
              meluhaitta: 'SATUNNAINEN_MELUHAITTA',
              polyhaitta: 'SATUNNAINEN_POLYHAITTA',
              tarinahaitta: 'TOISTUVA_TARINAHAITTA',
              kaistahaitta: 'YKSI_KAISTA_VAHENEE_KAHDELLA_AJOSUUNNALLA',
              kaistahaittojenPituus: 'PITUUS_ALLE_10_METRIA',
              lisatiedot: 'Lisätiedot',
            },
          ],
        },
        muutokset: [
          'areas[0].tyoalueet[1]',
          'areas[0].tyonTarkoitukset',
          'areas[0].meluhaitta',
          'areas[0].polyhaitta',
          'areas[0].tarinahaitta',
          'areas[0].kaistahaitta',
          'areas[0].kaistahaittojenPituus',
          'areas[0].lisatiedot',
        ],
        liitteet: [],
      };
      const { user } = await setup(application);
      await user.click(screen.getByRole('tab', { name: /alueet/i }));

      expect(screen.getAllByText('Täydennys:').length).toBe(8);
      expect(screen.getByText('394 m²')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Työalueille lasketut liikennehaittaindeksit ovat muuttuneet. Tarkista haittojenhallintasuunnitelma.',
        ),
      ).toBeInTheDocument();
    });

    test('Shows changed information in haittojen hallinta tab', async () => {
      const application = cloneDeep(hakemukset[12] as Application<KaivuilmoitusData>);
      application.applicationData.propertyDeveloperWithContacts = cloneDeep(
        application.applicationData.customerWithContacts,
      );
      application.taydennys = {
        id: 'c0a1fe7b-326c-4b25-a7bc-d1797762c01c',
        applicationData: {
          ...application.applicationData,
          areas: [
            {
              ...application.applicationData.areas[0],
              haittojenhallintasuunnitelma: {
                YLEINEN: 'Täydennetty työalueen yleisten haittojen hallintasuunnitelma',
                PYORALIIKENNE:
                  'Täydennetty pyöräliikenteelle koituvien työalueen haittojen hallintasuunnitelma',
                AUTOLIIKENNE:
                  'Täydennetty autoliikenteelle koituvien työalueen haittojen hallintasuunnitelma',
                LINJAAUTOLIIKENNE:
                  'Linja-autoliikenteelle koituvien työalueen haittojen hallintasuunnitelma',
                RAITIOLIIKENNE:
                  'Täydennetty raitioliikenteelle koituvien työalueen haittojen hallintasuunnitelma',
                MUUT: '',
              },
            },
          ],
        },
        muutokset: [
          'areas[0].haittojenhallintasuunnitelma[YLEINEN]',
          'areas[0].haittojenhallintasuunnitelma[PYORALIIKENNE]',
          'areas[0].haittojenhallintasuunnitelma[AUTOLIIKENNE]',
          'areas[0].haittojenhallintasuunnitelma[LINJAAUTOLIIKENNE]',
          'areas[0].haittojenhallintasuunnitelma[RAITOLIIKENNE]',
          'areas[0].haittojenhallintasuunnitelma[MUUT]',
        ],
        liitteet: [],
      };
      const { user } = await setup(application);
      await user.click(screen.getByRole('tab', { name: /haittojen hallinta/i }));

      expect(screen.getAllByText('Täydennys:').length).toBe(6);
    });

    test('Shows changed information in contacts tab', async () => {
      const application = cloneDeep(hakemukset[12] as Application<KaivuilmoitusData>);
      application.applicationData.propertyDeveloperWithContacts = cloneDeep(
        application.applicationData.customerWithContacts,
      );
      application.taydennys = {
        id: 'c0a1fe7b-326c-4b25-a7bc-d1797762c01c',
        applicationData: {
          ...application.applicationData,
          customerWithContacts: {
            customer: {
              ...application.applicationData.customerWithContacts!.customer,
              name: 'New name',
              email: 'newMail@test.com',
            },
            contacts: application.applicationData.customerWithContacts!.contacts,
          },
          propertyDeveloperWithContacts: null,
          invoicingCustomer: {
            ...application.applicationData.invoicingCustomer!,
            name: 'Uusi Laskutus Oy',
          },
        },
        muutokset: ['customerWithContacts', 'propertyDeveloperWithContacts', 'invoicingCustomer'],
        liitteet: [],
      };
      const { user } = await setup(application);
      await user.click(screen.getByRole('tab', { name: /yhteystiedot/i }));

      expect(screen.getAllByText('Täydennys:').length).toBe(2);
      expect(screen.getAllByText('Poistettu:').length).toBe(1);
      expect(screen.getByText('New name')).toBeInTheDocument();
      expect(screen.getByText('newMail@test.com')).toBeInTheDocument();
      expect(screen.getByText('Uusi Laskutus Oy')).toBeInTheDocument();
    });

    test('Shows changed information in attachments tab', async () => {
      const taydennysId = 'c0a1fe7b-326c-4b25-a7bc-d1797762c01c';
      const taydennysAttachments = createTaydennysAttachments(taydennysId, [
        { attachmentType: 'LIIKENNEJARJESTELY' },
        { attachmentType: 'VALTAKIRJA' },
        { attachmentType: 'MUU' },
      ]);
      const application = cloneDeep(hakemukset[12] as Application<KaivuilmoitusData>);
      application.taydennys = {
        id: taydennysId,
        applicationData: application.applicationData,
        muutokset: [],
        liitteet: taydennysAttachments,
      };
      const { user } = await setup(application);
      await user.click(screen.getByRole('tab', { name: /liitteet/i }));

      expect(screen.getAllByText('Täydennys:').length).toBe(3);
      taydennysAttachments.forEach((attachment) => {
        expect(screen.getByText(attachment.fileName)).toBeInTheDocument();
      });
    });

    test('Taydennys can be sent', async () => {
      const application = cloneDeep(hakemukset[12]) as Application<KaivuilmoitusData>;
      application.taydennys = {
        id: 'c0a1fe7b-326c-4b25-a7bc-d1797762c01d',
        applicationData: application.applicationData,
        muutokset: ['workDescription'],
        liitteet: [],
      };
      const { user } = await setup(application);
      await user.click(screen.getByRole('button', { name: 'Lähetä täydennys' }));
      await user.click(await screen.findByRole('button', { name: /vahvista/i }));

      expect(await screen.findByText(/täydennys lähetetty/i)).toBeInTheDocument();
    });

    test('Send taydennys button is not visible if there are no changes', async () => {
      const application = cloneDeep(hakemukset[12]) as Application<KaivuilmoitusData>;
      application.taydennys = {
        id: 'c0a1fe7b-326c-4b25-a7bc-d1797762c01d',
        applicationData: application.applicationData,
        muutokset: [],
        liitteet: [],
      };
      await setup(application);

      expect(screen.queryByRole('button', { name: 'Lähetä täydennys' })).not.toBeInTheDocument();
    });

    test('Send taydennys button is not visible if user does not have permission', async () => {
      server.use(
        http.get('/api/hankkeet/:hankeTunnus/whoami', async () => {
          return HttpResponse.json<SignedInUser>(USER_VIEW);
        }),
      );
      const application = cloneDeep(hakemukset[12]) as Application<KaivuilmoitusData>;
      application.taydennys = {
        id: 'c0a1fe7b-326c-4b25-a7bc-d1797762c01d',
        applicationData: application.applicationData,
        muutokset: ['workDescription'],
        liitteet: [],
      };
      await setup(application);

      expect(screen.queryByRole('button', { name: 'Lähetä täydennys' })).not.toBeInTheDocument();
    });

    test('Should be able to cancel taydennys', async () => {
      const application = cloneDeep(hakemukset[12]) as Application<KaivuilmoitusData>;
      application.taydennys = {
        id: 'c0a1fe7b-326c-4b25-a7bc-d1797762c01d',
        applicationData: application.applicationData,
        muutokset: ['workDescription'],
        liitteet: [],
      };
      const { user } = await setup(application);
      await user.click(screen.getByRole('button', { name: 'Peru täydennysluonnos' }));
      await user.click(await screen.findByRole('button', { name: /vahvista/i }));

      expect(await screen.findByText('Täydennysluonnos peruttiin')).toBeInTheDocument();
      expect(screen.getByText('Täydennysluonnos peruttiin onnistuneesti')).toBeInTheDocument();
    });

    test('Cancel taydennys button is not visible if taydennys field is null', async () => {
      const application = cloneDeep(hakemukset[12]) as Application<KaivuilmoitusData>;
      application.taydennys = null;
      await setup(application);

      expect(
        screen.queryByRole('button', { name: 'Peru täydennysluonnos' }),
      ).not.toBeInTheDocument();
    });

    test('Cancel taydennys button is not visible if user does not have permission', async () => {
      server.use(
        http.get('/api/hankkeet/:hankeTunnus/whoami', async () => {
          return HttpResponse.json<SignedInUser>(USER_VIEW);
        }),
      );
      const application = cloneDeep(hakemukset[12]) as Application<KaivuilmoitusData>;
      application.taydennys = {
        id: 'c0a1fe7b-326c-4b25-a7bc-d1797762c01d',
        applicationData: application.applicationData,
        muutokset: ['workDescription'],
        liitteet: [],
      };
      await setup(application);

      expect(
        screen.queryByRole('button', { name: 'Peru täydennysluonnos' }),
      ).not.toBeInTheDocument();
    });
  });

  describe('Muutosilmoitus', () => {
    async function setup(application: Application<KaivuilmoitusData>) {
      server.use(
        http.get('/api/hakemukset/:id', async () => {
          return HttpResponse.json<Application<KaivuilmoitusData>>(application);
        }),
      );
      const renderResult = render(<ApplicationViewContainer id={application.id!} />);
      await waitForLoadingToFinish();
      return renderResult;
    }

    test('Does not show create muutosilmoitus button if application has wrong status', async () => {
      const application = cloneDeep(hakemukset[7]) as Application<KaivuilmoitusData>;
      application.alluStatus = 'HANDLING';
      await setup(application);

      expect(screen.queryByRole('button', { name: 'Tee muutosilmoitus' })).not.toBeInTheDocument();
    });

    test('Creates muutosilmoitus and navigates to edit muutosilmoitus path if muutosilmoitus does not exist', async () => {
      const muutosilmoitusCreateSpy = jest.spyOn(muutosilmoitusApi, 'createMuutosilmoitus');
      const application = hakemukset[7] as Application<KaivuilmoitusData>;
      server.use(
        http.post('/api/hakemukset/:id/muutosilmoitus', async () => {
          return HttpResponse.json(
            {
              id: 'c0a1fe7b-326c-4b25-a7bc-d1797762c01d',
              applicationData: application.applicationData,
            },
            { status: 200 },
          );
        }),
      );
      const { user } = await setup(application);

      expect(screen.queryByText('Hakemukselle on luotu muutosilmoitus')).not.toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: 'Tee muutosilmoitus' }));

      expect(window.location.pathname).toBe(
        `/fi/kaivuilmoitus-muutosilmoitus/${application.id}/muokkaa`,
      );
      expect(muutosilmoitusCreateSpy).toHaveBeenCalledWith(application.id);
      muutosilmoitusCreateSpy.mockRestore();
    });

    test('Navigates to edit muutosilmoitus path if muutosilmoitus exists', async () => {
      const application = cloneDeep(hakemukset[7]) as Application<KaivuilmoitusData>;
      application.muutosilmoitus = {
        id: 'c0a1fe7b-326c-4b25-a7bc-d1797762c01d',
        applicationData: application.applicationData,
        sent: null,
        muutokset: [],
      };
      const { user } = await setup(application);
      await user.click(screen.getByRole('button', { name: 'Jatka muutosilmoitusta' }));

      expect(window.location.pathname).toBe(
        `/fi/kaivuilmoitus-muutosilmoitus/${application.id}/muokkaa`,
      );
    });

    test('Shows error notification if creating muutosilmoitus fails', async () => {
      server.use(
        http.post('/api/hakemukset/:id/muutosilmoitus', async () => {
          return HttpResponse.json(
            { errorMessage: 'Failed for testing purposes' },
            { status: 500 },
          );
        }),
      );
      const application = hakemukset[7] as Application<KaivuilmoitusData>;
      const { user } = await setup(application);
      await user.click(screen.getByRole('button', { name: 'Tee muutosilmoitus' }));

      expect(await screen.findByText('Tapahtui virhe. Yritä uudestaan.')).toBeInTheDocument();
    });

    test('Shows muutosilmoitus created notification and continue button if muutosilmoitus exists but is not sent', async () => {
      const application = cloneDeep(hakemukset[7]) as Application<KaivuilmoitusData>;
      application.muutosilmoitus = {
        id: 'c0a1fe7b-326c-4b25-a7bc-d1797762c01d',
        applicationData: application.applicationData,
        sent: null,
        muutokset: [],
      };
      await setup(application);

      expect(screen.getByText('Hakemukselle on luotu muutosilmoitus')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Jatka muutosilmoitusta' })).toBeInTheDocument();
    });

    test('Shows muutosilmoitus sent notification and hides continue button if muutosilmoitus is sent', async () => {
      const application = cloneDeep(hakemukset[7]) as Application<KaivuilmoitusData>;
      const sentDate = new Date();
      application.muutosilmoitus = {
        id: 'c0a1fe7b-326c-4b25-a7bc-d1797762c01d',
        muutokset: [],
        applicationData: application.applicationData,
        sent: sentDate,
      };
      await setup(application);

      expect(
        screen.getByText(
          `Hakemukselle on tehty muutosilmoitus, joka on lähetetty käsittelyyn ${format(
            sentDate,
            'd.M.yyyy HH:mm',
            {
              locale: fi,
            },
          )}`,
        ),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'Jatka muutosilmoitusta' }),
      ).not.toBeInTheDocument();
    });

    test('Shows changed information in basic information tab', async () => {
      const application = cloneDeep(hakemukset[12] as Application<KaivuilmoitusData>);
      const name = 'New name';
      const workDescription = 'New work description';
      application.muutosilmoitus = {
        id: 'c0a1fe7b-326c-4b25-a7bc-d1797762c01c',
        sent: null,
        applicationData: {
          ...application.applicationData,
          name,
          workDescription,
          constructionWork: false,
          maintenanceWork: true,
          emergencyWork: true,
          cableReports: [...(application.applicationData.cableReports || []), 'JS2300003'],
          placementContracts: [
            ...(application.applicationData.placementContracts || []),
            'SL1234568',
          ],
          areas: [
            {
              ...application.applicationData.areas[0],
              tyoalueet: [
                ...application.applicationData.areas[0].tyoalueet,
                {
                  area: 10,
                  geometry: {
                    type: 'Polygon',
                    crs: {
                      type: 'name',
                      properties: {
                        name: 'urn:ogc:def:crs:EPSG::3879',
                      },
                    },
                    coordinates: [
                      [
                        [25498581.440262634, 6679345.526261961],
                        [25498582.233686976, 6679350.99321805],
                        [25498576.766730886, 6679351.786642391],
                        [25498575.973306544, 6679346.319686302],
                        [25498581.440262634, 6679345.526261961],
                      ],
                    ],
                  },
                },
              ],
            },
          ],
        },
        muutokset: [
          'name',
          'workDescription',
          'constructionWork',
          'maintenanceWork',
          'emergencyWork',
          'cableReports',
          'placementContracts',
        ],
      };
      await setup(application);

      expect(screen.getAllByText('Muutos:').length).toBe(6);
      expect(screen.getAllByText('Poistettu:').length).toBe(1);
      expect(screen.getByText(name)).toBeInTheDocument();
      expect(screen.getByText(workDescription)).toBeInTheDocument();
      expect(screen.getByText('Olemassaolevan rakenteen kunnossapitotyöstä')).toBeInTheDocument();
      expect(screen.getAllByText('Uuden rakenteen tai johdon rakentamisesta').length).toBe(2);
      expect(
        screen.getByText(
          'Kaivutyö on aloitettu ennen johtoselvityksen tilaamista merkittävien vahinkojen välttämiseksi',
        ),
      ).toBeInTheDocument();
      expect(screen.getByText('JS2300003')).toBeInTheDocument();
      expect(screen.getByText('SL1234568')).toBeInTheDocument();
      expect(screen.getByText('221 m²')).toBeInTheDocument();
    });

    test('Shows changed information in areas tab', async () => {
      const application = cloneDeep(hakemukset[12] as Application<KaivuilmoitusData>);
      application.muutosilmoitus = {
        id: 'c0a1fe7b-326c-4b25-a7bc-d1797762c01c',
        sent: null,
        applicationData: {
          ...application.applicationData,
          areas: [
            {
              ...application.applicationData.areas[0],
              tyoalueet: [
                ...application.applicationData.areas[0].tyoalueet.slice(0, 1),
                {
                  area: 10,
                  geometry: {
                    type: 'Polygon',
                    crs: {
                      type: 'name',
                      properties: {
                        name: 'urn:ogc:def:crs:EPSG::3879',
                      },
                    },
                    coordinates: [
                      [
                        [25498574.56194478, 6679282.528783048],
                        [25498582.990384366, 6679282.528783048],
                        [25498582.990384366, 6679310.418567079],
                        [25498574.56194478, 6679310.418567079],
                        [25498574.56194478, 6679282.528783048],
                      ],
                    ],
                  },
                  tormaystarkasteluTulos: {
                    liikennehaittaindeksi: {
                      indeksi: 5,
                      tyyppi: HAITTA_INDEX_TYPE.AUTOLIIKENNEINDEKSI,
                    },
                    pyoraliikenneindeksi: 3,
                    autoliikenne: {
                      indeksi: 5,
                      haitanKesto: 5,
                      katuluokka: 5,
                      liikennemaara: 5,
                      kaistahaitta: 5,
                      kaistapituushaitta: 5,
                    },
                    linjaautoliikenneindeksi: 0,
                    raitioliikenneindeksi: 1,
                  },
                },
              ],
              tyonTarkoitukset: ['VESI', 'TIETOLIIKENNE'],
              meluhaitta: 'SATUNNAINEN_MELUHAITTA',
              polyhaitta: 'SATUNNAINEN_POLYHAITTA',
              tarinahaitta: 'TOISTUVA_TARINAHAITTA',
              kaistahaitta: 'YKSI_KAISTA_VAHENEE_KAHDELLA_AJOSUUNNALLA',
              kaistahaittojenPituus: 'PITUUS_ALLE_10_METRIA',
              lisatiedot: 'Lisätiedot',
            },
          ],
        },
        muutokset: [
          'areas[0].tyoalueet[1]',
          'areas[0].tyonTarkoitukset',
          'areas[0].meluhaitta',
          'areas[0].polyhaitta',
          'areas[0].tarinahaitta',
          'areas[0].kaistahaitta',
          'areas[0].kaistahaittojenPituus',
          'areas[0].lisatiedot',
        ],
      };
      const { user } = await setup(application);
      await user.click(screen.getByRole('tab', { name: /alueet/i }));

      expect(screen.getAllByText('Muutos:').length).toBe(8);
      expect(screen.getByText('394 m²')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Työalueille lasketut liikennehaittaindeksit ovat muuttuneet. Tarkista haittojenhallintasuunnitelma.',
        ),
      ).toBeInTheDocument();
    });

    test('Shows changed information in haittojen hallinta tab', async () => {
      const application = cloneDeep(hakemukset[12] as Application<KaivuilmoitusData>);
      application.applicationData.propertyDeveloperWithContacts = cloneDeep(
        application.applicationData.customerWithContacts,
      );
      application.muutosilmoitus = {
        id: 'c0a1fe7b-326c-4b25-a7bc-d1797762c01c',
        sent: null,
        applicationData: {
          ...application.applicationData,
          areas: [
            {
              ...application.applicationData.areas[0],
              haittojenhallintasuunnitelma: {
                YLEINEN: 'Täydennetty työalueen yleisten haittojen hallintasuunnitelma',
                PYORALIIKENNE:
                  'Täydennetty pyöräliikenteelle koituvien työalueen haittojen hallintasuunnitelma',
                AUTOLIIKENNE:
                  'Täydennetty autoliikenteelle koituvien työalueen haittojen hallintasuunnitelma',
                LINJAAUTOLIIKENNE:
                  'Linja-autoliikenteelle koituvien työalueen haittojen hallintasuunnitelma',
                RAITIOLIIKENNE:
                  'Täydennetty raitioliikenteelle koituvien työalueen haittojen hallintasuunnitelma',
                MUUT: '',
              },
            },
          ],
        },
        muutokset: [
          'areas[0].haittojenhallintasuunnitelma[YLEINEN]',
          'areas[0].haittojenhallintasuunnitelma[PYORALIIKENNE]',
          'areas[0].haittojenhallintasuunnitelma[AUTOLIIKENNE]',
          'areas[0].haittojenhallintasuunnitelma[LINJAAUTOLIIKENNE]',
          'areas[0].haittojenhallintasuunnitelma[RAITOLIIKENNE]',
          'areas[0].haittojenhallintasuunnitelma[MUUT]',
        ],
      };
      const { user } = await setup(application);
      await user.click(screen.getByRole('tab', { name: /haittojen hallinta/i }));

      expect(screen.getAllByText('Muutos:').length).toBe(6);
    });

    test('Shows changed information in contacts tab', async () => {
      const application = cloneDeep(hakemukset[12] as Application<KaivuilmoitusData>);
      application.applicationData.propertyDeveloperWithContacts = cloneDeep(
        application.applicationData.customerWithContacts,
      );
      application.muutosilmoitus = {
        id: 'c0a1fe7b-326c-4b25-a7bc-d1797762c01c',
        sent: null,
        applicationData: {
          ...application.applicationData,
          customerWithContacts: {
            customer: {
              ...application.applicationData.customerWithContacts!.customer,
              name: 'New name',
              email: 'newMail@test.com',
            },
            contacts: application.applicationData.customerWithContacts!.contacts,
          },
          propertyDeveloperWithContacts: null,
          invoicingCustomer: {
            ...application.applicationData.invoicingCustomer!,
            name: 'Uusi Laskutus Oy',
          },
        },
        muutokset: ['customerWithContacts', 'propertyDeveloperWithContacts', 'invoicingCustomer'],
      };
      const { user } = await setup(application);
      await user.click(screen.getByRole('tab', { name: /yhteystiedot/i }));

      expect(screen.getAllByText('Muutos:').length).toBe(2);
      expect(screen.getAllByText('Poistettu:').length).toBe(1);
      expect(screen.getByText('New name')).toBeInTheDocument();
      expect(screen.getByText('newMail@test.com')).toBeInTheDocument();
      expect(screen.getByText('Uusi Laskutus Oy')).toBeInTheDocument();
    });
  });
});
