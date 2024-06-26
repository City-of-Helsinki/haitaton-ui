import { cleanup } from '@testing-library/react';
import HankePortfolioComponent from './HankePortfolioComponent';
import { render, screen, waitFor, within } from '../../../testUtils/render';
import hankeList from '../../mocks/hankeList';
import { changeFilterDate } from '../../../testUtils/helperFunctions';
import { USER_VIEW, userDataByHanke } from '../../mocks/signedInUser';
import { AccessRightLevel, SignedInUserByHanke } from '../hankeUsers/hankeUser';
import { server } from '../../mocks/test-server';
import { rest } from 'msw';
import hankkeet from '../../mocks/data/hankkeet-data';
import { HankeDataDraft } from '../../types/hanke';
import HankePortfolioContainer from './HankePortfolioContainer';

const START_DATE_LABEL = 'Ajanjakson alku';
const END_DATE_LABEL = 'Ajanjakson loppu';
const SEARCH_PLACEHOLDER = 'Esim. hankkeen nimi tai tunnus';
const EMPTY_HANKE_LIST_TEXT =
  'Hankelistasi on tyhjä, sillä antamillasi hakuehdoilla ei löytynyt yhtään hanketta tai sinulla ei vielä ole hankkeita.';

afterEach(cleanup);

jest.setTimeout(90000);

const initHankkeetResponse = (response: HankeDataDraft[]) => {
  server.use(
    rest.get('/api/hankkeet', async (_, res, ctx) => {
      return res(ctx.status(200), ctx.json<HankeDataDraft[]>(response));
    }),
  );
};

const initSignedInUserResponse = (response: SignedInUserByHanke) => {
  server.use(
    rest.get('/api/my-permissions', async (_, res, ctx) => {
      return res(ctx.status(200), ctx.json<SignedInUserByHanke>(response));
    }),
  );
};

describe('HankePortfolioComponent', () => {
  test('Changing search text filters correct number of projects', async () => {
    const { user } = render(
      <HankePortfolioComponent hankkeet={hankeList} signedInUserByHanke={{}} />,
    );

    await user.type(
      screen.getByPlaceholderText(SEARCH_PLACEHOLDER),
      'Mannerheimintie autottomaksi',
    );
    await waitFor(() => {
      expect(screen.getByText('1 hakutulos'));
    });
    expect(screen.getByTestId('numberOfFilteredRows')).toHaveTextContent('1');

    await user.type(screen.getByPlaceholderText(SEARCH_PLACEHOLDER), 'elielin');
    await waitFor(() => {
      expect(screen.getByText('0 hakutulosta'));
    });
    expect(screen.getByTestId('numberOfFilteredRows')).toHaveTextContent('0');
    expect(screen.queryByText(EMPTY_HANKE_LIST_TEXT)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /tyhjennä hakuehdot/i }));
    await waitFor(() => {
      expect(screen.getByText('2 hakutulosta'));
    });
    expect(screen.getByTestId('numberOfFilteredRows')).toHaveTextContent('2');
  });

  test('Changing filter startDates filters correct number of projects', async () => {
    const renderedComponent = render(
      <HankePortfolioComponent hankkeet={hankeList} signedInUserByHanke={{}} />,
    );
    expect(renderedComponent.getByTestId('numberOfFilteredRows')).toHaveTextContent('2');
    changeFilterDate(START_DATE_LABEL, renderedComponent, '02.10.2022');
    expect(renderedComponent.getByTestId('numberOfFilteredRows')).toHaveTextContent('2');
    changeFilterDate(START_DATE_LABEL, renderedComponent, '06.10.2022');
    expect(renderedComponent.getByTestId('numberOfFilteredRows')).toHaveTextContent('1');
    changeFilterDate(START_DATE_LABEL, renderedComponent, '11.10.2022');
    expect(renderedComponent.getByTestId('numberOfFilteredRows')).toHaveTextContent('0');
    expect(screen.queryByText(EMPTY_HANKE_LIST_TEXT)).toBeInTheDocument();
    changeFilterDate(START_DATE_LABEL, renderedComponent, null);
  });

  test('Changing filter endDates filters correct number of projects', async () => {
    const renderedComponent = render(
      <HankePortfolioComponent hankkeet={hankeList} signedInUserByHanke={{}} />,
    );
    expect(renderedComponent.getByTestId('numberOfFilteredRows')).toHaveTextContent('2');
    changeFilterDate(END_DATE_LABEL, renderedComponent, '01.10.2022');
    expect(renderedComponent.getByTestId('numberOfFilteredRows')).toHaveTextContent('0');
    expect(screen.queryByText(EMPTY_HANKE_LIST_TEXT)).toBeInTheDocument();
    changeFilterDate(END_DATE_LABEL, renderedComponent, '05.10.2022');
    expect(renderedComponent.getByTestId('numberOfFilteredRows')).toHaveTextContent('2');
    changeFilterDate(END_DATE_LABEL, renderedComponent, '11.10.2022');
    expect(renderedComponent.getByTestId('numberOfFilteredRows')).toHaveTextContent('2');
    changeFilterDate(END_DATE_LABEL, renderedComponent, null);
    expect(renderedComponent.getByTestId('numberOfFilteredRows')).toHaveTextContent('2');
  });

  test('Changing Hanke type filters correct number of projects', async () => {
    const renderedComponent = render(
      <HankePortfolioComponent hankkeet={hankeList} signedInUserByHanke={{}} />,
    );
    await waitFor(() =>
      expect(renderedComponent.getByTestId('numberOfFilteredRows')).toHaveTextContent('2'),
    );
    await renderedComponent.user.click(
      renderedComponent.getByRole('button', { name: 'Työn tyyppi' }),
    );
    await renderedComponent.user.click(renderedComponent.getByText('Sähkö'));
    renderedComponent.getByText('Hankevaiheet').click();
    await waitFor(() => {
      expect(renderedComponent.getByTestId('numberOfFilteredRows')).toHaveTextContent('0');
    });
    expect(screen.queryByText(EMPTY_HANKE_LIST_TEXT)).toBeInTheDocument();
    await renderedComponent.user.click(
      renderedComponent.getByRole('button', { name: 'Työn tyyppi' }),
    );
    await renderedComponent.user.click(renderedComponent.getByText('Viemäri'));
    renderedComponent.getByText('Hankevaiheet').click();
    await waitFor(() => {
      expect(renderedComponent.getByTestId('numberOfFilteredRows')).toHaveTextContent('1');
    });
    await renderedComponent.user.click(
      renderedComponent.getByRole('button', { name: 'Työn tyyppi' }),
    );
    await renderedComponent.user.click(renderedComponent.getByText('Sadevesi'));
    renderedComponent.getByText('Hankevaiheet').click();
    await waitFor(() => {
      expect(renderedComponent.getByTestId('numberOfFilteredRows')).toHaveTextContent('2');
    });
  });

  test('Having no projects renders correct text and new hanke link opens hanke create dialog', async () => {
    const { user } = render(<HankePortfolioComponent hankkeet={[]} signedInUserByHanke={{}} />);

    expect(screen.queryByText(EMPTY_HANKE_LIST_TEXT)).toBeInTheDocument();

    const { getByRole } = within(screen.getByText('Tarkista hakuehdot', { exact: false }));
    await user.click(getByRole('link', { name: 'luo uusi hanke' }));
    expect(screen.getByRole('heading', { name: 'Luo uusi hanke' }));
  });

  test('Having no projects renders correct text without a link to new hanke when Hanke feature is not enabled', async () => {
    const OLD_ENV = { ...window._env_ };
    window._env_ = { ...OLD_ENV, REACT_APP_FEATURE_HANKE: 0 };

    render(<HankePortfolioComponent hankkeet={[]} signedInUserByHanke={{}} />);

    await waitFor(() => {
      expect(screen.queryByText(EMPTY_HANKE_LIST_TEXT)).toBeInTheDocument();
      expect(screen.queryByText('Tarkista hakuehdot')).not.toBeInTheDocument();
      expect(screen.queryByText('luo uusi hanke')).not.toBeInTheDocument();
    });

    jest.resetModules();
    window._env_ = OLD_ENV;
  });

  test('Should render edit hanke links for hankkeet that user has edit rights', async () => {
    const hankeTunnusList = hankeList.map((hanke) => hanke.hankeTunnus);
    const signedUserData: SignedInUserByHanke = {
      ...userDataByHanke(hankeTunnusList),
      [hankeTunnusList[0]]: USER_VIEW,
    };

    render(<HankePortfolioComponent hankkeet={hankeList} signedInUserByHanke={signedUserData} />);

    await waitFor(() => {
      expect(screen.queryAllByTestId('hankeEditLink').length).toBe(1);
    });
  });

  test('Should show draft state notification for hankkeet that are in draft state', async () => {
    render(<HankePortfolioComponent hankkeet={hankeList} signedInUserByHanke={{}} />);

    expect(screen.getAllByText('Luonnos')).toHaveLength(1);
  });

  test('Should show generated state notification for hankkeet that are generated', async () => {
    const generatedHanke = {
      generated: true,
      ...hankeList[0],
    };
    const editedHankeList = [generatedHanke, ...hankeList.slice(1)];
    const userData = userDataByHanke(editedHankeList.map((h) => h.hankeTunnus));

    render(<HankePortfolioComponent hankkeet={editedHankeList} signedInUserByHanke={userData} />);

    expect(editedHankeList).toHaveLength(2);
    expect(
      screen.getAllByText('Tämä hanke on muodostettu johtoselvityksen perusteella.'),
    ).toHaveLength(1);
  });

  test('Should show user permission info for hankkeet', () => {
    const userData = userDataByHanke(hankeList.map((hanke) => hanke.hankeTunnus));

    render(<HankePortfolioComponent hankkeet={hankeList} signedInUserByHanke={userData} />);

    expect(screen.getAllByText(/kaikki oikeudet/i)).toHaveLength(2);
  });

  test('Should show map only if there are hanke areas', async () => {
    const hankeWithoutArea = {
      ...hankeList[1],
      alueet: [],
    };
    const editedHankeList = [hankeList[0], hankeWithoutArea];
    const { user } = render(
      <HankePortfolioComponent hankkeet={editedHankeList} signedInUserByHanke={{}} />,
    );
    await user.click(screen.getByText(editedHankeList[0].nimi));
    await user.click(screen.getByText(editedHankeList[1].nimi));

    expect(screen.getAllByTestId('hanke-map')).toHaveLength(1);
    expect(screen.getAllByText('Hankealueita ei ole määritelty')).toHaveLength(1);
  });
});

describe('HankePortfolioContainer', () => {
  const HANKE_TUNNUS = 'HAI22-1';

  test('Should query data and render hanke editable if permitted', async () => {
    initHankkeetResponse([hankkeet[0]]);
    initSignedInUserResponse(userDataByHanke([HANKE_TUNNUS], AccessRightLevel.KAIKKI_OIKEUDET));

    render(<HankePortfolioContainer />);

    await waitFor(() => {
      expect(screen.queryByText(HANKE_TUNNUS)).toBeInTheDocument();
      expect(screen.getByTestId('hankeEditLink')).toBeInTheDocument();
    });
  });

  test('Should query data and render hanke not editable if not permitted', async () => {
    initHankkeetResponse([hankkeet[0]]);
    initSignedInUserResponse(userDataByHanke([HANKE_TUNNUS], AccessRightLevel.KATSELUOIKEUS));

    render(<HankePortfolioContainer />);

    await waitFor(() => {
      expect(screen.queryByText(HANKE_TUNNUS)).toBeInTheDocument();
      expect(screen.queryAllByTestId('hankeEditLink')).toHaveLength(0);
    });
  });

  test('Should focus on first hanke card header when changing page', async () => {
    initHankkeetResponse(hankkeet);

    const { user } = render(<HankePortfolioContainer />);

    await screen.findAllByTestId('hanke-card-header');
    expect(screen.getAllByTestId('hanke-card-header')[0]).not.toHaveFocus();
    await user.click(screen.getByRole('button', { name: 'Seuraava' }));
    expect(screen.getAllByTestId('hanke-card-header')[0]).toHaveFocus();
  });

  test('Should show error notification if loading hankkeet fails', async () => {
    server.use(
      rest.get('/api/hankkeet', async (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ errorMessage: 'Failed for testing purposes' }));
      }),
    );

    render(<HankePortfolioContainer />);

    await screen.findByText('Virhe tietojen lataamisessa.');
    expect(screen.queryByText('Yritä hetken päästä uudelleen.')).toBeInTheDocument();
  });
});
