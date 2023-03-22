import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '../../testUtils/render';
import { changeFilterDate } from '../../testUtils/helperFunctions';
import HankeMap from './HankeMap';

const startDateLabel = 'Ajanjakson alku';
const endDateLabel = 'Ajanjakson loppu';
const countOfFilteredHankkeet = 'countOfFilteredHankkeet';

jest.setTimeout(10000);

describe('HankeMap', () => {
  test('Render test', async () => {
    render(<HankeMap />);

    const user = userEvent.setup();

    expect(screen.getByLabelText('Ortokartta')).not.toBeChecked();
    expect(screen.getByLabelText('Kantakartta')).toBeChecked();
    await user.click(screen.getByText('Ortokartta'));
    expect(screen.getByLabelText('Ortokartta')).toBeChecked();
    expect(screen.getByLabelText('Kantakartta')).not.toBeChecked();
  });

  test('Number of projects displayed on the map can be controlled with dateRangeControl', async () => {
    const renderedComponent = render(<HankeMap />);

    await screen.findByPlaceholderText('Etsi osoitteella');

    expect(renderedComponent.getByTestId(countOfFilteredHankkeet)).toHaveTextContent('2');
    changeFilterDate(startDateLabel, renderedComponent, '1.1.2022');
    expect(renderedComponent.getByTestId(countOfFilteredHankkeet)).toHaveTextContent('2');
    changeFilterDate(endDateLabel, renderedComponent, '1.1.2022');
    expect(renderedComponent.getByTestId(countOfFilteredHankkeet)).toHaveTextContent('0');
    changeFilterDate(endDateLabel, renderedComponent, '12.12.2023');
    expect(renderedComponent.getByTestId(countOfFilteredHankkeet)).toHaveTextContent('2');
    changeFilterDate(startDateLabel, renderedComponent, '28.2.2023');
    expect(renderedComponent.getByTestId(countOfFilteredHankkeet)).toHaveTextContent('1');
    changeFilterDate(startDateLabel, renderedComponent, '1');
    expect(renderedComponent.getByTestId(countOfFilteredHankkeet)).toHaveTextContent('2');
    changeFilterDate(startDateLabel, renderedComponent, '1.1');
    expect(renderedComponent.getByTestId(countOfFilteredHankkeet)).toHaveTextContent('2');
    changeFilterDate(startDateLabel, renderedComponent, null);
    expect(renderedComponent.getByTestId(countOfFilteredHankkeet)).toHaveTextContent('2');
    changeFilterDate(endDateLabel, renderedComponent, null);
    expect(renderedComponent.getByTestId(countOfFilteredHankkeet)).toHaveTextContent('2');
    changeFilterDate(startDateLabel, renderedComponent, '1.1.2022');
    expect(renderedComponent.getByTestId(countOfFilteredHankkeet)).toHaveTextContent('2');
  });
});
