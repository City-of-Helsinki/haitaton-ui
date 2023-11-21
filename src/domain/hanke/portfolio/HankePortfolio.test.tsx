/// <reference types="cypress" />

import React from 'react';
import { cleanup } from '@testing-library/react';
import HankePortfolioComponent from './HankePortfolioComponent';
import { render, screen, waitFor } from '../../../testUtils/render';
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

afterEach(cleanup);

jest.setTimeout(30000);

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
    expect(
      screen.queryByText('Valitsemillasi hakuehdoilla ei löytynyt yhtään hanketta'),
    ).toBeInTheDocument();

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
    expect(
      screen.queryByText('Valitsemillasi hakuehdoilla ei löytynyt yhtään hanketta'),
    ).toBeInTheDocument();
    changeFilterDate(START_DATE_LABEL, renderedComponent, null);
  });

  test('Changing filter endDates filters correct number of projects', async () => {
    const renderedComponent = render(
      <HankePortfolioComponent hankkeet={hankeList} signedInUserByHanke={{}} />,
    );
    expect(renderedComponent.getByTestId('numberOfFilteredRows')).toHaveTextContent('2');
    changeFilterDate(END_DATE_LABEL, renderedComponent, '01.10.2022');
    expect(renderedComponent.getByTestId('numberOfFilteredRows')).toHaveTextContent('0');
    expect(
      screen.queryByText('Valitsemillasi hakuehdoilla ei löytynyt yhtään hanketta'),
    ).toBeInTheDocument();
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
    expect(renderedComponent.getByTestId('numberOfFilteredRows')).toHaveTextContent('2');
    await renderedComponent.user.click(
      renderedComponent.getByRole('button', { name: 'Työn tyyppi' }),
    );
    await renderedComponent.user.click(renderedComponent.getByText('Sähkö'));
    renderedComponent.getByText('Hankevaiheet').click();
    expect(renderedComponent.getByTestId('numberOfFilteredRows')).toHaveTextContent('0');
    expect(
      screen.queryByText('Valitsemillasi hakuehdoilla ei löytynyt yhtään hanketta'),
    ).toBeInTheDocument();
    await renderedComponent.user.click(
      renderedComponent.getByRole('button', { name: 'Työn tyyppi' }),
    );
    await renderedComponent.user.click(renderedComponent.getByText('Viemäri'));
    renderedComponent.getByText('Hankevaiheet').click();
    expect(renderedComponent.getByTestId('numberOfFilteredRows')).toHaveTextContent('1');
    await renderedComponent.user.click(
      renderedComponent.getByRole('button', { name: 'Työn tyyppi' }),
    );
    await renderedComponent.user.click(renderedComponent.getByText('Sadevesi'));
    renderedComponent.getByText('Hankevaiheet').click();
    expect(renderedComponent.getByTestId('numberOfFilteredRows')).toHaveTextContent('2');
  });

  test('Having no projects renders correct text', () => {
    render(<HankePortfolioComponent hankkeet={[]} signedInUserByHanke={{}} />);

    expect(screen.queryByText('Hankesalkussasi ei ole hankkeita')).toBeInTheDocument();
  });

  test('Should render edit hanke links for hankkeet that user has edit rights', async () => {
    const hankeTunnusList = hankeList.map((hanke) => hanke.hankeTunnus);
    const signedUserData: SignedInUserByHanke = {
      ...userDataByHanke(hankeTunnusList),
      [hankeTunnusList[0]]: USER_VIEW,
    };

    render(<HankePortfolioComponent hankkeet={hankeList} signedInUserByHanke={signedUserData} />);

    await waitFor(() => {
      expect(screen.queryAllByTestId('hankeEditLink')).toHaveLength(1);
    });
  });

  test('Should show draft state notification for hankkeet that are in draft state', async () => {
    render(<HankePortfolioComponent hankkeet={hankeList} signedInUserByHanke={{}} />);

    expect(
      screen.getAllByText(
        'Hanke on luonnostilassa. Alueiden haittatiedot ja muut pakolliset tiedot on täytettävä hankkeen julkaisemiseksi ja lupien lisäämiseksi.',
      ),
    ).toHaveLength(1);
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
});
