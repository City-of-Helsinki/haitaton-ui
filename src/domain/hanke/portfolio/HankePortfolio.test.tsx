/// <reference types="cypress" />

import React from 'react';
import { cleanup, fireEvent, RenderResult } from '@testing-library/react';
import HankePortfolioComponent from './HankePortfolioComponent';
import { render } from '../../../testUtils/render';
import hankeList from '../../mocks/hankeList';

const startDateLabel = 'Ajanjakson alku';
const endDateLabel = 'Ajanjakson loppu';

const changeFilterDate = (label: string, renderedComponent: RenderResult, value: string | null) => {
  fireEvent.change(renderedComponent.getByLabelText(label, { exact: false }), {
    target: { value },
  });
};

afterEach(cleanup);

describe.only('HankePortfolio', () => {
  test('Should match snapshot', async () => {
    const renderedComponent = render(<HankePortfolioComponent hankkeet={hankeList} />);
    expect(renderedComponent).toMatchSnapshot();
  });

  test('Changing filter startDates filters correct number of projects', async () => {
    const renderedComponent = render(<HankePortfolioComponent hankkeet={hankeList} />);
    expect(renderedComponent.getByTestId('numberOfFilteredRows')).toHaveTextContent('2');
    changeFilterDate(startDateLabel, renderedComponent, '2021-10-02:00:00Z');
    expect(renderedComponent.getByTestId('numberOfFilteredRows')).toHaveTextContent('2');
    changeFilterDate(startDateLabel, renderedComponent, '2021-10-06:00:00Z');
    expect(renderedComponent.getByTestId('numberOfFilteredRows')).toHaveTextContent('1');
    changeFilterDate(startDateLabel, renderedComponent, '2021-10-11:00:00Z');
    expect(renderedComponent.getByTestId('numberOfFilteredRows')).toHaveTextContent('0');
    changeFilterDate(startDateLabel, renderedComponent, null);
  });

  test('Changing filter endDates filters correct number of projects', async () => {
    const renderedComponent = render(<HankePortfolioComponent hankkeet={hankeList} />);
    expect(renderedComponent.getByTestId('numberOfFilteredRows')).toHaveTextContent('2');
    changeFilterDate(endDateLabel, renderedComponent, '2021-10-01:00:00Z');
    expect(renderedComponent.getByTestId('numberOfFilteredRows')).toHaveTextContent('0');
    changeFilterDate(endDateLabel, renderedComponent, '2021-10-05:00:00Z');
    expect(renderedComponent.getByTestId('numberOfFilteredRows')).toHaveTextContent('2');
    changeFilterDate(endDateLabel, renderedComponent, '2021-10-11:00:00Z');
    expect(renderedComponent.getByTestId('numberOfFilteredRows')).toHaveTextContent('2');
    changeFilterDate(endDateLabel, renderedComponent, null);
    expect(renderedComponent.getByTestId('numberOfFilteredRows')).toHaveTextContent('2');
  });
});
