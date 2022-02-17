/// <reference types="cypress" />

import React from 'react';
import { cleanup } from '@testing-library/react';
import HankePortfolioComponent from './HankePortfolioComponent';
import { render } from '../../../testUtils/render';
import hankeList from '../../mocks/hankeList';
import { changeFilterDate } from '../../../testUtils/helperFunctions';

const startDateLabel = 'Ajanjakson alku';
const endDateLabel = 'Ajanjakson loppu';

afterEach(cleanup);

describe.only('HankePortfolio', () => {
  test('Changing filter startDates filters correct number of projects', async () => {
    const renderedComponent = render(<HankePortfolioComponent hankkeet={hankeList} />);
    expect(renderedComponent.getByTestId('numberOfFilteredRows')).toHaveTextContent('2');
    changeFilterDate(startDateLabel, renderedComponent, '02.10.2022');
    expect(renderedComponent.getByTestId('numberOfFilteredRows')).toHaveTextContent('2');
    changeFilterDate(startDateLabel, renderedComponent, '06.10.2022');
    expect(renderedComponent.getByTestId('numberOfFilteredRows')).toHaveTextContent('1');
    changeFilterDate(startDateLabel, renderedComponent, '11.10.2022');
    expect(renderedComponent.getByTestId('numberOfFilteredRows')).toHaveTextContent('0');
    changeFilterDate(startDateLabel, renderedComponent, null);
  });

  test('Changing filter endDates filters correct number of projects', async () => {
    const renderedComponent = render(<HankePortfolioComponent hankkeet={hankeList} />);
    expect(renderedComponent.getByTestId('numberOfFilteredRows')).toHaveTextContent('2');
    changeFilterDate(endDateLabel, renderedComponent, '01.10.2022');
    expect(renderedComponent.getByTestId('numberOfFilteredRows')).toHaveTextContent('0');
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
    renderedComponent.getByText('Hankkeen tyypit').click();
    renderedComponent.getByText('Sähkö').click();
    renderedComponent.getByText('Hankevaiheet').click();
    expect(renderedComponent.getByTestId('numberOfFilteredRows')).toHaveTextContent('0');
    renderedComponent.getByText('Hankkeen tyypit').click();
    renderedComponent.getByText('Viemäri').click();
    renderedComponent.getByText('Hankevaiheet').click();
    expect(renderedComponent.getByTestId('numberOfFilteredRows')).toHaveTextContent('1');
    renderedComponent.getByText('Hankkeen tyypit').click();
    renderedComponent.getByText('Sadevesi').click();
    renderedComponent.getByText('Hankevaiheet').click();
    expect(renderedComponent.getByTestId('numberOfFilteredRows')).toHaveTextContent('2');
  });
});
