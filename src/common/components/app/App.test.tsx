import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import App from './App';

test('Should render maintenance page if maintenance text is defined in environment variables', async () => {
  const maintenanceTextFI = 'Huoltokatkon takia Haitaton ei ole käytettävissä';
  const OLD_ENV = { ...window._env_ };
  window._env_ = {
    ...OLD_ENV,
    REACT_APP_MAINTENANCE_TEXT_FI: maintenanceTextFI,
  };
  const { default: i18n } = await import('../../../locales/i18n');

  render(
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>,
  );

  expect(screen.getByText('Huoltokatko Haitattomassa')).toBeInTheDocument();
  expect(screen.getByText(maintenanceTextFI)).toBeInTheDocument();

  jest.resetModules();
  window._env_ = OLD_ENV;
});

test('Should render normal app if maintenance text is not defined in environment variables', async () => {
  const OLD_ENV = { ...window._env_ };
  window._env_ = {
    ...OLD_ENV,
    REACT_APP_MAINTENANCE_TEXT_FI: '',
  };
  const { default: i18n } = await import('../../../locales/i18n');

  render(
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>,
  );

  await screen.findByText('Tervetuloa Haitaton-palveluun');
  expect(
    screen.getByText(
      'Palvelu yleisille alueille sijoittuvien hankkeiden ja niiden haittojen seurantaan',
    ),
  ).toBeInTheDocument();
  expect(screen.queryByText('Huoltokatko Haitattomassa')).not.toBeInTheDocument();

  jest.resetModules();
  window._env_ = OLD_ENV;
});
