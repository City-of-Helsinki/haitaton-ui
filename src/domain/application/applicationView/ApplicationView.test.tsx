import { delay, http, HttpResponse } from 'msw';
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
import {
  Application,
  JohtoselvitysData,
  KaivuilmoitusData,
  PaperDecisionReceiver,
} from '../types/application';
import * as taydennysApi from '../taydennys/taydennysApi';
import { USER_VIEW } from '../../mocks/signedInUser';
import {
  createMuutosilmoitusAttachments,
  createTaydennysAttachments,
} from '../../mocks/attachments';
import * as muutosilmoitusApi from '../muutosilmoitus/muutosilmoitusApi';
import { HAITTA_INDEX_TYPE } from '../../common/haittaIndexes/types';
import { PathParams } from 'msw/lib/core/utils/matching/matchRequestUrl';

// Inline mock for map components to stabilize snapshot (dynamic OpenLayers DOM removed)
jest.mock('../../map/components/OwnHankeMap/OwnHankeMap', () => ({
  __esModule: true,
  // Use unknown instead of any to satisfy lint rules
  default: ({
    hanke,
    tyoalueet,
  }: {
    hanke: { hankeTunnus?: string } | undefined;
    tyoalueet?: unknown[];
  }) => (
    <div data-testid="mock-own-hanke-map">
      <p>MockOwnHankeMap</p>
      <p>hanke:{hanke?.hankeTunnus}</p>
      <p>tyoalueet:{Array.isArray(tyoalueet) ? tyoalueet.length : 0}</p>
    </div>
  ),
}));

jest.mock('../../map/components/OwnHankeMap/OwnHankeMapHeader', () => ({
  __esModule: true,
  default: ({ hankeTunnus }: { hankeTunnus: string }) => (
    <div data-testid="mock-own-hanke-map-header">Alueiden sijainti ({hankeTunnus})</div>
  ),
}));

describe('Cable report application view', () => {
  test('Correct information about application should be displayed', async () => {
    render(<ApplicationViewContainer id={4} />);
    await waitForLoadingToFinish();

    expect(screen.getAllByText('Mannerheimintien kairaukset').length).toBe(2);
    expect(screen.queryByText('JS2300003')).toBeInTheDocument();
    expect(screen.queryByText('Odottaa käsittelyä')).toBeInTheDocument();
    expect(screen.queryByText('Kaikki oikeudet')).toBeInTheDocument();
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

  test('Confirming send disables dialog buttons', async () => {
    server.use(
      http.post('/api/hakemukset/:id/laheta', async () => {
        await delay(500);
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
    expect(confirmButton).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Lähetetään' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Peruuta' })).toBeDisabled();

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
        liitteet: [],
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
        liitteet: [],
      };
      await setup(application);

      expect(screen.getByText('Hakemuksella on keskeneräinen muutosilmoitus.')).toBeInTheDocument();
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
        liitteet: [],
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
        liitteet: [],
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
        liitteet: [],
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
        liitteet: [],
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
        liitteet: [],
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

    test('Shows changed information in attachments tab', async () => {
      const muutosilmoitusId = 'c0a1fe7b-326c-4b25-a7bc-d1797762c01c';
      const muutosilmoitusAttachments = createMuutosilmoitusAttachments(muutosilmoitusId, [
        { attachmentType: 'LIIKENNEJARJESTELY' },
        { attachmentType: 'VALTAKIRJA' },
        { attachmentType: 'MUU' },
      ]);
      const application = cloneDeep(hakemukset[7] as Application<KaivuilmoitusData>);
      application.muutosilmoitus = {
        id: 'c0a1fe7b-326c-4b25-a7bc-d1797762c01d',
        applicationData: application.applicationData,
        sent: null,
        liitteet: muutosilmoitusAttachments,
        muutokset: ['workDescription'],
      };
      const { user } = await setup(application);
      await user.click(screen.getByRole('tab', { name: /liitteet/i }));

      expect(screen.getAllByText('Muutos:').length).toBe(3);
      muutosilmoitusAttachments.forEach((attachment) => {
        expect(screen.getByText(attachment.fileName)).toBeInTheDocument();
      });
    });

    test('Should be able to send muutosilmoitus without paper decision order', async () => {
      const application = cloneDeep(hakemukset[7]) as Application<KaivuilmoitusData>;
      application.muutosilmoitus = {
        id: 'c0a1fe7b-326c-4b25-a7bc-d1797762c01d',
        applicationData: application.applicationData,
        sent: null,
        liitteet: [],
        muutokset: ['workDescription'],
      };
      const { user } = await setup(application);
      server.use(
        http.get(`/api/hakemukset/:id`, async () => {
          return HttpResponse.json({
            ...application,
            muutosilmoitus: {
              ...application.muutosilmoitus,
              sent: new Date(),
            },
          });
        }),
        http.post(`/api/muutosilmoitukset/:id/laheta`, async () => {
          return HttpResponse.json({
            ...application,
            muutosilmoitus: null,
          });
        }),
      );

      const sendButton = await screen.findByRole('button', { name: 'Lähetä muutosilmoitus' });
      expect(sendButton).toBeEnabled();
      await user.click(sendButton);

      expect(await screen.findByText('Lähetä muutosilmoitus?')).toBeInTheDocument();
      const confirmButton = screen.getByRole('button', { name: 'Vahvista' });
      expect(confirmButton).toBeEnabled();
      await user.click(confirmButton);

      expect(await screen.findByText('Muutosilmoitus lähetetty')).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'Lähetä muutosilmoitus' }),
      ).not.toBeInTheDocument();
    });

    test('Should be able to send application with paper decision order', async () => {
      const application = cloneDeep(hakemukset[7]) as Application<KaivuilmoitusData>;
      application.muutosilmoitus = {
        id: 'c0a1fe7b-326c-4b25-a7bc-d1797762c01d',
        applicationData: application.applicationData,
        sent: null,
        liitteet: [],
        muutokset: ['workDescription'],
      };
      application.applicationData.paperDecisionReceiver = null;
      let pdr: PaperDecisionReceiver | null = null;
      const { user } = await setup(application);

      server.use(
        http.get(`/api/hakemukset/:id`, async () => {
          return HttpResponse.json({
            ...application,
            muutosilmoitus: {
              ...application.muutosilmoitus,
              sent: new Date(),
            },
          });
        }),
        http.post<PathParams, { paperDecisionReceiver: PaperDecisionReceiver }>(
          `/api/muutosilmoitukset/:id/laheta`,
          async ({ request }) => {
            const { paperDecisionReceiver } = await request.json();
            pdr = paperDecisionReceiver;
            return HttpResponse.json({
              ...application,
              muutosilmoitus: null,
            });
          },
        ),
      );

      const sendButton = await screen.findByRole('button', { name: 'Lähetä muutosilmoitus' });
      expect(sendButton).toBeEnabled();
      await user.click(sendButton);

      expect(await screen.findByText('Lähetä muutosilmoitus?')).toBeInTheDocument();
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

      expect(await screen.findByText('Muutosilmoitus lähetetty')).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Lähetä hakemus' })).not.toBeInTheDocument();
      expect(pdr).toEqual({
        name: 'Pekka Paperinen',
        streetAddress: 'Paperipolku 3 A 4',
        postalCode: '00451',
        city: 'Helsinki',
      });
    });

    test('Should not be able to send muutosilmoitus if it has moved to handling in Allu', async () => {
      const application = cloneDeep(hakemukset[7]) as Application<KaivuilmoitusData>;
      application.muutosilmoitus = {
        id: 'c0a1fe7b-326c-4b25-a7bc-d1797762c01d',
        applicationData: application.applicationData,
        sent: new Date(),
        liitteet: [],
        muutokset: ['workDescription'],
      };
      await setup(application);

      expect(
        screen.queryByRole('button', { name: 'Lähetä muutosilmoitus' }),
      ).not.toBeInTheDocument();
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
      const application = cloneDeep(hakemukset[7]) as Application<KaivuilmoitusData>;
      application.muutosilmoitus = {
        id: 'c0a1fe7b-326c-4b25-a7bc-d1797762c01d',
        applicationData: application.applicationData,
        sent: null,
        liitteet: [],
        muutokset: ['workDescription'],
      };
      await setup(application);

      await screen.findByRole('button', { name: 'Lähetä muutosilmoitus' }, { timeout: 10000 });
      const sendButton = screen.getByRole('button', { name: 'Lähetä muutosilmoitus' });
      expect(sendButton).toBeDisabled();
    });

    test('Should not show buttons if user does not have correct permission', async () => {
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
      const application = cloneDeep(hakemukset[7]) as Application<KaivuilmoitusData>;
      application.muutosilmoitus = {
        id: 'c0a1fe7b-326c-4b25-a7bc-d1797762c01d',
        applicationData: application.applicationData,
        sent: null,
        liitteet: [],
        muutokset: ['workDescription'],
      };
      await setup(application);

      expect(
        screen.queryByRole('button', { name: 'Jatka muutosilmoitusta' }),
      ).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Peru muutosilmoitus' })).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'Lähetä muutosilmoitus' }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'Ilmoita toiminnalliseen kuntoon' }),
      ).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Ilmoita valmiiksi' })).not.toBeInTheDocument();
    });

    test('Should not send multiple requests if clicking muutosilmoitus cancel confirm button many times', async () => {
      server.use(
        http.delete('/api/muutosilmoitukset/:id', async () => {
          await delay(200);
          return new HttpResponse();
        }),
      );
      const application = cloneDeep(hakemukset[7]) as Application<KaivuilmoitusData>;
      application.muutosilmoitus = {
        id: 'c0a1fe7b-326c-4b25-a7bc-d1797762c01d',
        applicationData: application.applicationData,
        sent: null,
        liitteet: [],
        muutokset: ['workDescription'],
      };
      const cancelMuutosilmoitus = jest.spyOn(muutosilmoitusApi, 'cancelMuutosilmoitus');
      const { user } = await setup(application);

      await screen.findByRole('button', { name: 'Peru muutosilmoitus' });

      await user.click(screen.getByRole('button', { name: 'Peru muutosilmoitus' }));
      const confirmCancelButton = screen.getByRole('button', { name: 'Vahvista' });
      await user.click(confirmCancelButton);
      await user.click(confirmCancelButton);
      await user.click(confirmCancelButton);
      await screen.findByText('Muutosilmoitus peruttiin onnistuneesti');

      expect(cancelMuutosilmoitus).toHaveBeenCalledTimes(1);

      cancelMuutosilmoitus.mockRestore();
    });

    test('Confirming send disables dialog buttons', async () => {
      const application = cloneDeep(hakemukset[7]) as Application<KaivuilmoitusData>;
      application.muutosilmoitus = {
        id: 'c0a1fe7b-326c-4b25-a7bc-d1797762c01d',
        applicationData: application.applicationData,
        sent: null,
        liitteet: [],
        muutokset: ['workDescription'],
      };
      const { user } = await setup(application);
      server.use(
        http.get(`/api/hakemukset/:id`, async () => {
          return HttpResponse.json({
            ...application,
            muutosilmoitus: {
              ...application.muutosilmoitus,
              sent: new Date(),
            },
          });
        }),
        http.post(`/api/muutosilmoitukset/:id/laheta`, async () => {
          await delay(500);
          return HttpResponse.json({
            ...application,
            muutosilmoitus: null,
          });
        }),
      );
      const sendApplication = jest.spyOn(muutosilmoitusApi, 'sendMuutosilmoitus');

      const sendButton = await screen.findByRole('button', { name: 'Lähetä muutosilmoitus' });
      await user.click(sendButton);

      expect(await screen.findByText('Lähetä muutosilmoitus?')).toBeInTheDocument();
      const confirmButton = screen.getByRole('button', { name: 'Vahvista' });
      expect(confirmButton).toBeEnabled();
      await user.click(confirmButton);
      expect(confirmButton).toBeDisabled();
      expect(screen.getByRole('button', { name: 'Lähetetään' })).toBeDisabled();
      expect(screen.getByRole('button', { name: 'Peruuta' })).toBeDisabled();

      expect(sendApplication).toHaveBeenCalledTimes(1);

      sendApplication.mockRestore();
    });

    test('Should be able to cancel muutosilmoitus', async () => {
      const application = cloneDeep(hakemukset[13]) as Application<KaivuilmoitusData>;
      const { user } = await setup(application);
      await user.click(screen.getByRole('button', { name: 'Peru muutosilmoitus' }));
      await user.click(await screen.findByRole('button', { name: /vahvista/i }));

      expect(await screen.findByText('Muutosilmoitus peruttiin')).toBeInTheDocument();
      expect(screen.getByText('Muutosilmoitus peruttiin onnistuneesti')).toBeInTheDocument();
    });

    test('Cancel muutosilmoitus button is not visible if muutosilmoitus field is null', async () => {
      const application = cloneDeep(hakemukset[13]) as Application<KaivuilmoitusData>;
      application.muutosilmoitus = null;
      await setup(application);

      expect(screen.queryByRole('button', { name: 'Peru muutosilmoitus' })).not.toBeInTheDocument();
    });

    test('Cancel muutosilmoitus button is not visible if user does not have permission', async () => {
      server.use(
        http.get('/api/hankkeet/:hankeTunnus/whoami', async () => {
          return HttpResponse.json<SignedInUser>(USER_VIEW);
        }),
      );
      const application = cloneDeep(hakemukset[13]) as Application<KaivuilmoitusData>;
      await setup(application);

      expect(screen.queryByRole('button', { name: 'Peru muutosilmoitus' })).not.toBeInTheDocument();
    });
  });
});

describe('Completed hanke', () => {
  test('Should not show any buttons', async () => {
    render(<ApplicationViewContainer id={15} />);
    await waitForLoadingToFinish();

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
