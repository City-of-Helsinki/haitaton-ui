import React from 'react';
import { Provider } from 'react-redux';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../testUtils/render';
import { store } from '../../common/redux/store';
import HankeMap from './HankeMap';
import HankeDrawer from './HankeDrawer';

describe('Map tile layers can be controlled by layercontrol and share the same state', () => {
  test('Map tile layer toggled control changes when clicked', async () => {
    render(
      <Provider store={store}>
        <HankeMap />
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
});
