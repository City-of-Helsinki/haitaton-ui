import React from 'react';
import mockAxios from 'jest-mock-axios';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../testUtils/render';
import { changeFilterDate } from '../../testUtils/helperFunctions';
import HankeMap from './HankeMap';
import hankeMockList from '../mocks/hankeList';

const startDateLabel = 'Ajanjakson alku';
const endDateLabel = 'Ajanjakson loppu';
const countOfFilteredHankkeet = 'countOfFilteredHankkeet';

describe('HankeMap', () => {
  test('Render test', async () => {
    render(<HankeMap />);

    expect(screen.getByLabelText('Ortokartta')).not.toBeChecked();
    expect(screen.getByLabelText('Kantakartta')).toBeChecked();
    await userEvent.click(screen.getByText('Ortokartta'));
    expect(screen.getByLabelText('Ortokartta')).toBeChecked();
    expect(screen.getByLabelText('Kantakartta')).not.toBeChecked();
  });

  test('Number of projects displayed on the map can be controlled with dateRangeControl', async () => {
    mockAxios.get.mockResolvedValueOnce({ data: hankeMockList });

    const renderedComponent = render(<HankeMap />);

    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenCalledWith('/hankkeet', { params: { geometry: true } });
    });
    expect(renderedComponent.getByTestId(countOfFilteredHankkeet)).toHaveTextContent('2');
    changeFilterDate(startDateLabel, renderedComponent, '01.01.2021');
    expect(renderedComponent.getByTestId(countOfFilteredHankkeet)).toHaveTextContent('2');
    changeFilterDate(endDateLabel, renderedComponent, '01.01.2021');
    expect(renderedComponent.getByTestId(countOfFilteredHankkeet)).toHaveTextContent('0');
    changeFilterDate(endDateLabel, renderedComponent, '12.12.2021');
    expect(renderedComponent.getByTestId(countOfFilteredHankkeet)).toHaveTextContent('2');
    changeFilterDate(startDateLabel, renderedComponent, '06.10.2021');
    expect(renderedComponent.getByTestId(countOfFilteredHankkeet)).toHaveTextContent('1');
    changeFilterDate(startDateLabel, renderedComponent, '1');
    expect(renderedComponent.getByTestId(countOfFilteredHankkeet)).toHaveTextContent('2');
    changeFilterDate(startDateLabel, renderedComponent, '1.1');
    expect(renderedComponent.getByTestId(countOfFilteredHankkeet)).toHaveTextContent('2');
    changeFilterDate(startDateLabel, renderedComponent, null);
    expect(renderedComponent.getByTestId(countOfFilteredHankkeet)).toHaveTextContent('2');
    changeFilterDate(endDateLabel, renderedComponent, null);
    expect(renderedComponent.getByTestId(countOfFilteredHankkeet)).toHaveTextContent('2');
  });
});
