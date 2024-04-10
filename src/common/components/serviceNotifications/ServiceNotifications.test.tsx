import React from 'react';
import ServiceNotifications from './ServiceNotifications';
import { render, screen } from '../../../testUtils/render';

test('Should render INFO banner if environment variables are set', async () => {
  const OLD_ENV = { ...window._env_ };
  window._env_ = {
    ...OLD_ENV,
    REACT_APP_INFO_NOTIFICATION_LABEL: 'Tiedote',
    REACT_APP_INFO_NOTIFICATION_TEXT_FI: 'Tämä on tiedote',
  };

  render(<ServiceNotifications />);

  expect(screen.queryByText('Tiedote')).toBeInTheDocument();
  expect(screen.queryByText('Tämä on tiedote')).toBeInTheDocument();

  jest.resetModules();
  window._env_ = OLD_ENV;
});
