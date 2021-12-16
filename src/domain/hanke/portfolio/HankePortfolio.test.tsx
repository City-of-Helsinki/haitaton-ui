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
  test('Should match snapshot', async () => {
    const renderedComponent = render(<HankePortfolioComponent hankkeet={hankeList} />);
    expect(renderedComponent).toMatchSnapshot();
  });

  test('Changing filter startDates filters correct number of projects', async () => {
    const renderedComponent = render(<HankePortfolioComponent hankkeet={hankeList} />);
    expect(renderedComponent.getByTestId('numberOfFilteredRows')).toHaveTextContent('2');
    changeFilterDate(startDateLabel, renderedComponent, '02.10.2021');
    expect(renderedComponent.getByTestId('numberOfFilteredRows')).toHaveTextContent('2');
    changeFilterDate(startDateLabel, renderedComponent, '06.10.2021');
    expect(renderedComponent.getByTestId('numberOfFilteredRows')).toHaveTextContent('1');
    changeFilterDate(startDateLabel, renderedComponent, '11.10.2021');
    expect(renderedComponent.getByTestId('numberOfFilteredRows')).toHaveTextContent('0');
    changeFilterDate(startDateLabel, renderedComponent, null);
  });

  test('Changing filter endDates filters correct number of projects', async () => {
    const renderedComponent = render(<HankePortfolioComponent hankkeet={hankeList} />);
    expect(renderedComponent.getByTestId('numberOfFilteredRows')).toHaveTextContent('2');
    changeFilterDate(endDateLabel, renderedComponent, '01.10.2021');
    expect(renderedComponent.getByTestId('numberOfFilteredRows')).toHaveTextContent('0');
    changeFilterDate(endDateLabel, renderedComponent, '05.10.2021');
    expect(renderedComponent.getByTestId('numberOfFilteredRows')).toHaveTextContent('2');
    changeFilterDate(endDateLabel, renderedComponent, '11.10.2021');
    expect(renderedComponent.getByTestId('numberOfFilteredRows')).toHaveTextContent('2');
    changeFilterDate(endDateLabel, renderedComponent, null);
    expect(renderedComponent.getByTestId('numberOfFilteredRows')).toHaveTextContent('2');
  });
});
