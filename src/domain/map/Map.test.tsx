import React from 'react';
import { Provider } from 'react-redux';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../testUtils/render';
import { store } from '../../common/redux/store';
import HankeMapComponent from './HankeMapComponent';
import HankeDrawer from './HankeDrawer';

describe('Map tile layers can be controlled by layercontrol and share the same state', () => {
  test('Map tile layer toggled control changes when clicked', async () => {
    render(
      <Provider store={store}>
        <HankeMapComponent projectsData={[]} />
      </Provider>
    );

    expect(screen.getByLabelText('Ortokartta')).not.toBeChecked();
    expect(screen.getByLabelText('Kantakartta')).toBeChecked();
    await userEvent.click(screen.getByText('Ortokartta'));
    expect(screen.getByLabelText('Ortokartta')).toBeChecked();
    expect(screen.getByLabelText('Kantakartta')).not.toBeChecked();
  });

  test('HankeDrawer tile layer toggled control changes when clicked', async () => {
    /* eslint-disable  */
    render(
      <Provider store={store}>
        <HankeDrawer geometry={undefined} onChangeGeometries={() => {}} />
      </Provider>
    );
    /* eslint-enable  */

    expect(screen.getByLabelText('Ortokartta')).toBeChecked();
    expect(screen.getByLabelText('Kantakartta')).not.toBeChecked();
    await userEvent.click(screen.getByText('Kantakartta'));
    expect(screen.getByLabelText('Ortokartta')).not.toBeChecked();
    expect(screen.getByLabelText('Kantakartta')).toBeChecked();
  });

  test('Number of projects displayed on the map can be controlled with dateRangeControl', async () => {
    // TODO: provide mock API response object to projectsData in order to test the component

    const { getByTestId } = render(
      <Provider store={store}>
        <HankeMapComponent projectsData={[]} />
      </Provider>
    );

    expect(getByTestId('countOfFilteredHankkeet')).toHaveTextContent('0');
    // TODO: change the input date
    // TODO: expect the number of filtered hankkeet has changed
  });
});
