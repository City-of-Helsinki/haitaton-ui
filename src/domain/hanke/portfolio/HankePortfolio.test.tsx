/// <reference types="cypress" />

import React from 'react';
import { cleanup } from '@testing-library/react';
import HankePortfolioComponent from './HankePortfolioComponent';
import { render, screen, waitFor } from '../../../testUtils/render';
import hankeList from '../../mocks/hankeList';
import { changeFilterDate } from '../../../testUtils/helperFunctions';

const startDateLabel = 'Ajanjakson alku';
const endDateLabel = 'Ajanjakson loppu';

afterEach(cleanup);

jest.setTimeout(20000);

describe.only('HankePortfolio', () => {
  test('Changing search text filters correct number of projects', async () => {
    const { user } = render(<HankePortfolioComponent hankkeet={hankeList} />);

    await user.type(screen.getByLabelText('Haku'), 'Mannerheimintie autottomaksi');
    await waitFor(() => {
      expect(screen.getByText('1 hakutulos'));
    });
    expect(screen.getByTestId('numberOfFilteredRows')).toHaveTextContent('1');

    await user.type(screen.getByLabelText('Haku'), 'elielin');
    await waitFor(() => {
      expect(screen.getByText('0 hakutulosta'));
    });
    expect(screen.getByTestId('numberOfFilteredRows')).toHaveTextContent('0');
    expect(
      screen.queryByText('Valitsemillasi hakuehdoilla ei löytynyt yhtään hanketta')
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /tyhjennä hakuehdot/i }));
    await waitFor(() => {
      expect(screen.getByText('2 hakutulosta'));
    });
    expect(screen.getByTestId('numberOfFilteredRows')).toHaveTextContent('2');
  });

  test('Changing filter startDates filters correct number of projects', async () => {
    const renderedComponent = render(<HankePortfolioComponent hankkeet={hankeList} />);
    expect(renderedComponent.getByTestId('numberOfFilteredRows')).toHaveTextContent('2');
    changeFilterDate(startDateLabel, renderedComponent, '02.10.2022');
    expect(renderedComponent.getByTestId('numberOfFilteredRows')).toHaveTextContent('2');
    changeFilterDate(startDateLabel, renderedComponent, '06.10.2022');
    expect(renderedComponent.getByTestId('numberOfFilteredRows')).toHaveTextContent('1');
    changeFilterDate(startDateLabel, renderedComponent, '11.10.2022');
    expect(renderedComponent.getByTestId('numberOfFilteredRows')).toHaveTextContent('0');
    expect(
      screen.queryByText('Valitsemillasi hakuehdoilla ei löytynyt yhtään hanketta')
    ).toBeInTheDocument();
    changeFilterDate(startDateLabel, renderedComponent, null);
  });

  test('Changing filter endDates filters correct number of projects', async () => {
    const renderedComponent = render(<HankePortfolioComponent hankkeet={hankeList} />);
    expect(renderedComponent.getByTestId('numberOfFilteredRows')).toHaveTextContent('2');
    changeFilterDate(endDateLabel, renderedComponent, '01.10.2022');
    expect(renderedComponent.getByTestId('numberOfFilteredRows')).toHaveTextContent('0');
    expect(
      screen.queryByText('Valitsemillasi hakuehdoilla ei löytynyt yhtään hanketta')
    ).toBeInTheDocument();
    changeFilterDate(endDateLabel, renderedComponent, '05.10.2022');
    expect(renderedComponent.getByTestId('numberOfFilteredRows')).toHaveTextContent('2');
    changeFilterDate(endDateLabel, renderedComponent, '11.10.2022');
    expect(renderedComponent.getByTestId('numberOfFilteredRows')).toHaveTextContent('2');
    changeFilterDate(endDateLabel, renderedComponent, null);
    expect(renderedComponent.getByTestId('numberOfFilteredRows')).toHaveTextContent('2');
  });

  test('Changing Hanke type filters correct number of projects', async () => {
    const renderedComponent = render(<HankePortfolioComponent hankkeet={hankeList} />);
    expect(renderedComponent.getByTestId('numberOfFilteredRows')).toHaveTextContent('2');
    renderedComponent.getByRole('button', { name: 'Työn tyyppi' }).click();
    renderedComponent.getByText('Sähkö').click();
    renderedComponent.getByText('Hankevaiheet').click();
    expect(renderedComponent.getByTestId('numberOfFilteredRows')).toHaveTextContent('0');
    expect(
      screen.queryByText('Valitsemillasi hakuehdoilla ei löytynyt yhtään hanketta')
    ).toBeInTheDocument();
    renderedComponent.getByRole('button', { name: 'Työn tyyppi' }).click();
    renderedComponent.getByText('Viemäri').click();
    renderedComponent.getByText('Hankevaiheet').click();
    expect(renderedComponent.getByTestId('numberOfFilteredRows')).toHaveTextContent('1');
    renderedComponent.getByRole('button', { name: 'Työn tyyppi' }).click();
    renderedComponent.getByText('Sadevesi').click();
    renderedComponent.getByText('Hankevaiheet').click();
    expect(renderedComponent.getByTestId('numberOfFilteredRows')).toHaveTextContent('2');
  });

  test('Having no projects renders correct text', () => {
    render(<HankePortfolioComponent hankkeet={[]} />);

    expect(screen.queryByText('Hankesalkussasi ei ole hankkeita')).toBeInTheDocument();
  });
});
