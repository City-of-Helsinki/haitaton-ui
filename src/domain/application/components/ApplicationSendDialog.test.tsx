import { render, screen } from '../../../testUtils/render';
import ApplicationSendDialog from './ApplicationSendDialog';
import { waitFor } from '@testing-library/react';

test('Shows correct information when opened for excavation notification', async () => {
  render(
    <ApplicationSendDialog
      type="EXCAVATION_NOTIFICATION"
      isOpen={true}
      isLoading={false}
      onClose={() => {}}
      onSend={() => {}}
    />,
  );

  expect(screen.getByText(/lähetä hakemus\?/i)).toBeInTheDocument();
  expect(
    screen.getByText(
      'Hakemuksen päätös ja mahdolliset täydennyspyynnöt tulevat Haitaton-järjestelmään. Lähettämällä hakemuksen, sitoudut sähköiseen tiedoksiantoon. Halutessasi voit tilata päätöksen myös paperisena ilmoittamaasi osoitteeseen.',
    ),
  ).toBeInTheDocument();
  const orderPaperDecisionButton = screen.getByRole('button', {
    name: 'Tilaan päätöksen myös paperisena',
  });
  expect(orderPaperDecisionButton).toBeInTheDocument();
  expect(orderPaperDecisionButton).toBeEnabled();
  const confirmButton = screen.getByRole('button', { name: 'Vahvista' });
  expect(confirmButton).toBeInTheDocument();
  await waitFor(() => expect(confirmButton).toBeEnabled(), { timeout: 5000 });
  const cancelButton = screen.getByRole('button', { name: 'Peruuta' });
  expect(cancelButton).toBeInTheDocument();
  expect(cancelButton).toBeEnabled();
});

test('Shows correct information when opened for cable report', async () => {
  render(
    <ApplicationSendDialog
      type="CABLE_REPORT"
      isOpen={true}
      isLoading={false}
      onClose={() => {}}
      onSend={() => {}}
    />,
  );

  expect(screen.getByText(/lähetä hakemus\?/i)).toBeInTheDocument();
  expect(
    screen.getByText(
      'Hakemuksen päätös ja mahdolliset täydennyspyynnöt tulevat Haitaton-järjestelmään. Lähettämällä hakemuksen, sitoudut sähköiseen tiedoksiantoon. Halutessasi voit tilata päätöksen myös paperisena ilmoittamaasi osoitteeseen.',
    ),
  ).toBeInTheDocument();
  const orderPaperDecisionButton = screen.getByRole('button', {
    name: 'Tilaan päätöksen myös paperisena',
  });
  expect(orderPaperDecisionButton).toBeInTheDocument();
  expect(orderPaperDecisionButton).toBeEnabled();
  const confirmButton = screen.getByRole('button', { name: 'Vahvista' });
  expect(confirmButton).toBeInTheDocument();
  await waitFor(() => expect(confirmButton).toBeEnabled(), { timeout: 5000 });
  const cancelButton = screen.getByRole('button', { name: 'Peruuta' });
  expect(cancelButton).toBeInTheDocument();
  expect(cancelButton).toBeEnabled();
});

test('Shows correct information when opened for cable report when paper decision feature is disabled', async () => {
  const OLD_ENV = { ...window._env_ };
  window._env_ = { ...OLD_ENV, REACT_APP_FEATURE_CABLE_REPORT_PAPER_DECISION: 0 };
  render(
    <ApplicationSendDialog
      type="CABLE_REPORT"
      isOpen={true}
      isLoading={false}
      onClose={() => {}}
      onSend={() => {}}
    />,
  );

  expect(screen.getByText(/lähetä hakemus\?/i)).toBeInTheDocument();
  expect(
    screen.getByText(
      'Hakemuksen päätös ja mahdolliset täydennyspyynnöt tulevat Haitaton-järjestelmään. Lähettämällä hakemuksen, sitoudut sähköiseen tiedoksiantoon.',
    ),
  ).toBeInTheDocument();
  const orderPaperDecisionButton = screen.queryByRole('button', {
    name: 'Tilaan päätöksen myös paperisena',
  });
  expect(orderPaperDecisionButton).not.toBeInTheDocument();
  const confirmButton = screen.getByRole('button', { name: 'Vahvista' });
  expect(confirmButton).toBeInTheDocument();
  await waitFor(() => expect(confirmButton).toBeEnabled(), { timeout: 5000 });
  const cancelButton = screen.getByRole('button', { name: 'Peruuta' });
  expect(cancelButton).toBeInTheDocument();
  expect(cancelButton).toBeEnabled();

  jest.resetModules();
  window._env_ = OLD_ENV;
});

test('Shows correct information when ordering paper decision', async () => {
  const { user } = render(
    <ApplicationSendDialog
      type="EXCAVATION_NOTIFICATION"
      isOpen={true}
      isLoading={false}
      onClose={() => {}}
      onSend={() => {}}
    />,
  );

  const orderPaperDecisionButton = screen.getByRole('button', {
    name: 'Tilaan päätöksen myös paperisena',
  });
  await user.click(orderPaperDecisionButton);
  expect(await screen.findByText('Täytä vastaanottajan tiedot')).toBeInTheDocument();
  expect(
    screen.getByText('Täytä vastaanottajan tiedot tilataksesi päätöksen myös paperisena.'),
  ).toBeInTheDocument();
  const nameInput = screen.getByText('Nimi');
  expect(nameInput).toBeInTheDocument();
  expect(nameInput).toBeEnabled();
  const streetAddressInput = screen.getByText('Katuosoite');
  expect(streetAddressInput).toBeInTheDocument();
  expect(streetAddressInput).toBeEnabled();
  const postalCodeInput = screen.getByText('Postinumero');
  expect(postalCodeInput).toBeInTheDocument();
  expect(postalCodeInput).toBeEnabled();
  const cityInput = screen.getByText('Postitoimipaikka');
  expect(cityInput).toBeInTheDocument();
  expect(cityInput).toBeEnabled();
  const confirmButton = screen.getByRole('button', { name: 'Vahvista' });
  expect(confirmButton).toBeInTheDocument();
  expect(confirmButton).toBeDisabled();
  const cancelButton = screen.getByRole('button', { name: 'Peruuta' });
  expect(cancelButton).toBeInTheDocument();
  expect(cancelButton).toBeEnabled();
});

test('Enables confirmation button when form is filled', async () => {
  const { user } = render(
    <ApplicationSendDialog
      type="EXCAVATION_NOTIFICATION"
      isOpen={true}
      isLoading={false}
      onClose={() => {}}
      onSend={() => {}}
    />,
  );

  const confirmButton = screen.getByRole('button', { name: 'Vahvista' });
  const orderPaperDecisionButton = screen.getByRole('button', {
    name: 'Tilaan päätöksen myös paperisena',
  });
  await user.click(orderPaperDecisionButton);
  await screen.findByText('Täytä vastaanottajan tiedot');
  expect(confirmButton).toBeDisabled();
  const nameInput = screen.getByText('Nimi');
  await user.type(nameInput, 'Pekka Paperinen');
  expect(confirmButton).toBeDisabled();
  const streetAddressInput = screen.getByText('Katuosoite');
  await user.type(streetAddressInput, 'Paperitie 1');
  expect(confirmButton).toBeDisabled();
  const postalCodeInput = screen.getByText('Postinumero');
  await user.type(postalCodeInput, '00100');
  expect(confirmButton).toBeDisabled();
  const cityInput = screen.getByText('Postitoimipaikka');
  await user.type(cityInput, 'Helsinki');
  expect(confirmButton).toBeEnabled();
});

test('Confirm calls onSend', async () => {
  const onSend = jest.fn();
  const { user } = render(
    <ApplicationSendDialog
      type="EXCAVATION_NOTIFICATION"
      isOpen={true}
      isLoading={false}
      onClose={() => {}}
      onSend={onSend}
    />,
  );

  const orderPaperDecisionButton = screen.getByRole('button', {
    name: 'Tilaan päätöksen myös paperisena',
  });
  await user.click(orderPaperDecisionButton);
  await screen.findByText('Täytä vastaanottajan tiedot');
  const nameInput = screen.getByText('Nimi');
  await user.type(nameInput, 'Pekka Paperinen');
  const streetAddressInput = screen.getByText('Katuosoite');
  await user.type(streetAddressInput, 'Paperitie 1');
  const postalCodeInput = screen.getByText('Postinumero');
  await user.type(postalCodeInput, '00100');
  const cityInput = screen.getByText('Postitoimipaikka');
  await user.type(cityInput, 'Helsinki');
  const confirmButton = screen.getByRole('button', { name: 'Vahvista' });
  await user.click(confirmButton);
  expect(onSend).toHaveBeenCalled();
});

test('Cancel calls onClose', async () => {
  const onClose = jest.fn();
  const { user } = render(
    <ApplicationSendDialog
      type="EXCAVATION_NOTIFICATION"
      isOpen={true}
      isLoading={false}
      onClose={onClose}
      onSend={() => {}}
    />,
  );

  const cancelButton = screen.getByRole('button', { name: 'Peruuta' });
  await user.click(cancelButton);
  expect(onClose).toHaveBeenCalled();
});
