import { rest } from 'msw';
import { render, screen, within } from '../../../testUtils/render';
import { waitForLoadingToFinish } from '../../../testUtils/helperFunctions';
import HankeViewContainer from './HankeViewContainer';
import { server } from '../../mocks/test-server';
import { SignedInUser } from '../hankeUsers/hankeUser';

function getViewPermissionForUser() {
  server.use(
    rest.get('/api/hankkeet/:hankeTunnus/whoami', async (_, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json<SignedInUser>({
          hankeKayttajaId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          kayttooikeustaso: 'KATSELUOIKEUS',
          kayttooikeudet: ['VIEW'],
        }),
      );
    }),
  );
}

test('Draft state notification is rendered when hanke is in draft state', async () => {
  render(<HankeViewContainer hankeTunnus="HAI22-1" />);

  await waitForLoadingToFinish();

  const draftStateElement = screen.getByTestId('hankeDraftStateNotification');
  const { getByRole } = within(draftStateElement);

  expect(draftStateElement).toBeInTheDocument();
  expect(getByRole('listitem', { name: /perustiedot/i })).toBeInTheDocument();
  expect(getByRole('listitem', { name: /alueet/i })).toBeInTheDocument();
  expect(getByRole('listitem', { name: /yhteystiedot/i })).toBeInTheDocument();
});

test('Draft state notification only shows form pages with missing information', async () => {
  render(<HankeViewContainer hankeTunnus="HAI22-4" />);

  await waitForLoadingToFinish();

  const draftStateElement = screen.getByTestId('hankeDraftStateNotification');
  const { queryByRole, getByRole } = within(draftStateElement);

  expect(draftStateElement).toBeInTheDocument();
  expect(queryByRole('listitem', { name: /perustiedot/i })).not.toBeInTheDocument();
  expect(getByRole('listitem', { name: /alueet/i })).toBeInTheDocument();
  expect(getByRole('listitem', { name: /yhteystiedot/i })).toBeInTheDocument();
});

test('Add application button is displayed when hanke is in PUBLIC state', async () => {
  render(<HankeViewContainer hankeTunnus="HAI22-2" />);

  await waitForLoadingToFinish();

  expect(screen.queryByRole('button', { name: /lisää hakemus/i })).toBeInTheDocument();
});

test('Add application button is hidden when hanke is not in PUBLIC state', async () => {
  render(<HankeViewContainer hankeTunnus="HAI22-1" />);

  await waitForLoadingToFinish();

  expect(screen.queryByRole('button', { name: /lisää hakemus/i })).not.toBeInTheDocument();
});

test('Draft state notification is not rendered when hanke is not in draft state', async () => {
  render(<HankeViewContainer hankeTunnus="HAI22-2" />);

  await waitForLoadingToFinish();

  const draftStateElement = screen.queryByText(/hanke on luonnostilassa/i, { exact: false });

  expect(draftStateElement).not.toBeInTheDocument();
});

test('Generated state notification is rendered when hanke is in generated state', async () => {
  render(<HankeViewContainer hankeTunnus="HAI22-11" />);

  await waitForLoadingToFinish();
  const generatedStateElements = screen.queryAllByText(
    /hanke on muodostettu johtoselvityksen perusteella/i,
    { exact: false },
  );
  expect(generatedStateElements.length).toBe(1);
});

test('Generated state notification is not rendered when hanke is not generated', async () => {
  render(<HankeViewContainer hankeTunnus="HAI22-1" />);

  await waitForLoadingToFinish();
  const generatedStateElements = screen.queryAllByText(
    /hanke on muodostettu johtoselvityksen perusteella/i,
    { exact: false },
  );
  expect(generatedStateElements.length).toBe(0);
});

test('Correct information about hanke should be displayed', async () => {
  const { user } = render(<HankeViewContainer hankeTunnus="HAI22-3" />);

  await waitForLoadingToFinish();

  // Data in basic information tab
  expect(screen.getAllByText('Mannerheimintien kaukolämpö').length).toBe(2);
  expect(screen.getAllByText('HAI22-3').length).toBe(2);
  expect(
    screen.queryByText(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
    ),
  ).toBeInTheDocument();
  expect(screen.queryByText('Mannerheimintie 6')).toBeInTheDocument();
  expect(screen.queryByText('2.1.2023')).toBeInTheDocument();
  expect(screen.queryByText('24.2.2023')).toBeInTheDocument();
  expect(screen.queryByText('Ohjelmointi')).toBeInTheDocument();
  expect(screen.queryByText('Kaukolämpö')).toBeInTheDocument();
  expect(screen.queryByText('Ei')).toBeInTheDocument();
  expect(screen.queryByText('11974 m²')).toBeInTheDocument();

  // Data in sidebar
  expect(screen.queryByText('Hankealue 1 (11974 m²)')).toBeInTheDocument();
  expect(screen.queryByText('2.1.2023–24.2.2023')).toBeInTheDocument();

  // Change to areas tab
  await user.click(screen.getByRole('tab', { name: /alueet/i }));

  // Data in areas tab
  expect(screen.queryByText('Hankealue 1')).toBeInTheDocument();
  expect(screen.getAllByText('2.1.2023–24.2.2023').length).toBe(2);
  expect(screen.getByTestId('test-liikennehaittaindeksi')).toHaveTextContent('3');
  expect(screen.getByTestId('test-pyoraliikenneindeksi')).toHaveTextContent('3.5');
  expect(screen.getByTestId('test-raitioliikenneindeksi')).toHaveTextContent('2');
  expect(screen.getByTestId('test-linjaautoliikenneindeksi')).toHaveTextContent('1');
  expect(screen.getByTestId('test-autoliikenneindeksi')).toHaveTextContent('1.5');
  expect(screen.queryByText('11974 m²')).toBeInTheDocument();
  expect(screen.queryByText('Meluhaitta: Satunnainen haitta')).toBeInTheDocument();
  expect(screen.queryByText('Pölyhaitta: Lyhytaikainen toistuva haitta')).toBeInTheDocument();
  expect(screen.queryByText('Tärinähaitta: Pitkäkestoinen jatkuva haitta')).toBeInTheDocument();
  expect(
    screen.queryByText('Autoliikenteen kaistahaitta: Vähentää kaistan yhdellä ajosuunnalla'),
  ).toBeInTheDocument();
  expect(screen.queryByText('Kaistahaittojen pituus: Alle 10 m')).toBeInTheDocument();

  // Change to contacts tab
  await user.click(screen.getByRole('tab', { name: /yhteystiedot/i }));

  // Data in contacts tab
  expect(screen.queryByText('Yritys')).toBeInTheDocument();
  expect(screen.queryByText('Kauppisen maansiirtofirma KY')).toBeInTheDocument();
  expect(screen.queryByText('5341034-5')).toBeInTheDocument();
  expect(screen.queryByText('toimisto@testi.com')).toBeInTheDocument();
  expect(screen.queryByText('0501234567')).toBeInTheDocument();
});

test('It is possible to delete hanke if it has no active applications', async () => {
  const { user } = render(<HankeViewContainer hankeTunnus="HAI22-3" />);

  await waitForLoadingToFinish();

  const cancelHankeButton = screen.getByRole('button', { name: /peru hanke/i });

  expect(cancelHankeButton).toBeInTheDocument();

  await user.click(cancelHankeButton);

  await user.click(screen.getByRole('button', { name: /vahvista/i }));

  expect(window.location.pathname).toBe('/fi/hankesalkku');
  expect(screen.queryByText('Hanke poistettiin onnistuneesti')).toBeInTheDocument();
});

test('It is not possible to delete hanke if it has active applications', () => {
  render(<HankeViewContainer hankeTunnus="HAI22-2" />);

  expect(screen.queryByRole('button', { name: /peru hanke/i })).not.toBeInTheDocument();
});

test('It is possible to delete hanke if it has only cancelled applications', async () => {
  const { user } = render(<HankeViewContainer hankeTunnus="HAI22-4" />);

  await waitForLoadingToFinish();

  const cancelHankeButton = screen.getByRole('button', { name: /peru hanke/i });

  expect(cancelHankeButton).toBeInTheDocument();

  await user.click(cancelHankeButton);

  await user.click(screen.getByRole('button', { name: /vahvista/i }));

  expect(window.location.pathname).toBe('/fi/hankesalkku');
  expect(screen.queryByText('Hanke poistettiin onnistuneesti')).toBeInTheDocument();
});

test('Should render correct number of applications if they exist', async () => {
  const { user } = render(<HankeViewContainer hankeTunnus="HAI22-2" />);

  await waitForLoadingToFinish();

  await user.click(screen.getByRole('tab', { name: /hakemukset/i }));

  expect(screen.getAllByTestId('application-card')).toHaveLength(4);
});

test('Should show information if no applications exist', async () => {
  const { user } = render(<HankeViewContainer hankeTunnus="HAI22-1" />);

  await waitForLoadingToFinish();

  await user.click(screen.getByRole('tab', { name: /hakemukset/i }));

  expect(screen.queryByText('Hankkeella ei ole lisättyjä hakemuksia')).toBeInTheDocument();
});

test('Should show error notification if loading applications fails', async () => {
  server.use(
    rest.get('/api/hankkeet/:hankeTunnus/hakemukset', async (_, res, ctx) => {
      return res(ctx.status(500), ctx.json({ errorMessage: 'Failed for testing purposes' }));
    }),
  );

  const { user } = render(<HankeViewContainer hankeTunnus="HAI22-1" />);

  await waitForLoadingToFinish();

  await user.click(screen.getByRole('tab', { name: /hakemukset/i }));

  expect(screen.queryByText('Virhe tietojen lataamisessa.')).toBeInTheDocument();
  expect(screen.queryByText('Yritä hetken päästä uudelleen.')).toBeInTheDocument();
});

test('Should navigate to application view when clicking application identifier link', async () => {
  const { user } = render(<HankeViewContainer hankeTunnus="HAI22-2" />);

  await waitForLoadingToFinish();
  await user.click(screen.getByRole('tab', { name: /hakemukset/i }));
  await user.click(screen.getByTestId('applicationViewLinkIdentifier-2'));

  expect(window.location.pathname).toBe('/fi/hakemus/2');
  expect(screen.queryByText('Mannerheimintien kuopat')).toBeInTheDocument();
});

test('Should navigate to application view when clicking the eye icon', async () => {
  const { user } = render(<HankeViewContainer hankeTunnus="HAI22-2" />);

  await waitForLoadingToFinish();
  await user.click(screen.getByRole('tab', { name: /hakemukset/i }));
  await user.click(screen.getByTestId('applicationViewLink-2'));

  expect(window.location.pathname).toBe('/fi/hakemus/2');
  expect(screen.queryByText('Mannerheimintien kuopat')).toBeInTheDocument();
});

test('Should not show edit hanke button if user does not have EDIT permission', async () => {
  getViewPermissionForUser();
  render(<HankeViewContainer hankeTunnus="HAI22-2" />);

  await waitForLoadingToFinish();

  expect(screen.queryByRole('button', { name: 'Muokkaa hanketta' })).not.toBeInTheDocument();
});

test('Should not show add application button if user does not have EDIT_APPLICATIONS permission', async () => {
  getViewPermissionForUser();
  render(<HankeViewContainer hankeTunnus="HAI22-2" />);

  await waitForLoadingToFinish();

  expect(screen.queryByRole('button', { name: 'Lisää hakemus' })).not.toBeInTheDocument();
});

test('Should not show end hanke and remove hanke buttons if user does not have DELETE permission', async () => {
  getViewPermissionForUser();
  render(<HankeViewContainer hankeTunnus="HAI22-2" />);

  await waitForLoadingToFinish();

  expect(screen.queryByRole('button', { name: 'Päätä hanke' })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Peru hanke' })).not.toBeInTheDocument();
});

test('Should show map if there are hanke areas', async () => {
  render(<HankeViewContainer hankeTunnus="HAI22-2" />);

  await waitForLoadingToFinish();

  expect(screen.getByTestId('hanke-map')).toBeInTheDocument();
});

test('Should not show map if there are no hanke areas', async () => {
  render(<HankeViewContainer hankeTunnus="HAI22-5" />);

  await waitForLoadingToFinish();

  expect(screen.queryByTestId('hanke-map')).not.toBeInTheDocument();
});

test('Should not show user management button if access rights feature is not enabled', async () => {
  const OLD_ENV = { ...window._env_ };
  window._env_ = { ...OLD_ENV, REACT_APP_FEATURE_ACCESS_RIGHTS: '0' };
  render(<HankeViewContainer hankeTunnus="HAI22-2" />);
  await waitForLoadingToFinish();

  expect(screen.queryByRole('button', { name: 'Käyttäjähallinta' })).not.toBeInTheDocument();
  jest.resetModules();
  window._env_ = OLD_ENV;
});

test('Should show user management button if access rights feature is enabled', async () => {
  const OLD_ENV = { ...window._env_ };
  window._env_ = { ...OLD_ENV, REACT_APP_FEATURE_ACCESS_RIGHTS: '1' };
  render(<HankeViewContainer hankeTunnus="HAI22-2" />);
  await waitForLoadingToFinish();

  expect(screen.queryByRole('button', { name: 'Käyttäjähallinta' })).toBeInTheDocument();
  jest.resetModules();
  window._env_ = OLD_ENV;
});
