import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../testUtils/render';
import HankeMap from './HankeMap';
import HankeDrawer from './components/HankeDrawer/HankeDrawer';
import hankeMockList from '../mocks/hankeList';

describe('Map tile layers can be controlled by layercontrol and share the same state', () => {
  test('Map tile layer toggled control changes when clicked', async () => {
    render(<HankeMap projectsData={[]} />);

    expect(screen.getByLabelText('Ortokartta')).not.toBeChecked();
    expect(screen.getByLabelText('Kantakartta')).toBeChecked();
    await userEvent.click(screen.getByText('Ortokartta'));
    expect(screen.getByLabelText('Ortokartta')).toBeChecked();
    expect(screen.getByLabelText('Kantakartta')).not.toBeChecked();
  });

  test('HankeDrawer tile layer toggled control changes when clicked', async () => {
    render(<HankeDrawer geometry={undefined} onChangeGeometries={() => ({})} />);

    expect(screen.getByLabelText('Ortokartta')).toBeChecked();
    expect(screen.getByLabelText('Kantakartta')).not.toBeChecked();
    await userEvent.click(screen.getByText('Kantakartta'));
    expect(screen.getByLabelText('Ortokartta')).not.toBeChecked();
    expect(screen.getByLabelText('Kantakartta')).toBeChecked();
  });

  test('Number of projects displayed on the map can be controlled with dateRangeControl', async () => {
    const { getByTestId } = render(<HankeMap projectsData={hankeMockList} />);

    expect(getByTestId('countOfFilteredHankkeet')).toHaveTextContent('1');
    // TODO: change the input date
    // TODO: expect the number of filtered hankkeet has changed
  });
});
