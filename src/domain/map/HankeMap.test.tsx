import React from 'react';
import mockAxios from 'jest-mock-axios';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../testUtils/render';
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

    const { getByTestId } = render(<HankeMap />);

    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenCalledWith('/hankkeet', { params: { geometry: true } });
    });

    await waitFor(() => expect(getByTestId(countOfFilteredHankkeet)).toHaveTextContent('2'));

    fireEvent.change(screen.getByLabelText(startDateLabel, { exact: false }), {
      target: { value: '2021-01-01:00:00Z' },
    });

    expect(getByTestId(countOfFilteredHankkeet)).toHaveTextContent('2');

    fireEvent.change(screen.getByLabelText(endDateLabel, { exact: false }), {
      target: { value: '2021-01-01:00:00Z' },
    });

    expect(getByTestId(countOfFilteredHankkeet)).toHaveTextContent('0');

    fireEvent.change(screen.getByLabelText(endDateLabel, { exact: false }), {
      target: { value: '2021-12-12:00:00Z' },
    });

    expect(getByTestId(countOfFilteredHankkeet)).toHaveTextContent('2');

    fireEvent.change(screen.getByLabelText(startDateLabel, { exact: false }), {
      target: { value: '2021-10-06:00:00Z' },
    });

    expect(getByTestId(countOfFilteredHankkeet)).toHaveTextContent('1');
  });
});
