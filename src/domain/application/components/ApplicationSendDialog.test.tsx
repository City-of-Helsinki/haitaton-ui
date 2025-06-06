import { render, screen } from '../../../testUtils/render';
import ApplicationSendDialog from './ApplicationSendDialog';
import { waitFor } from '@testing-library/react';
import { server } from '../../mocks/test-server';
import { http, HttpResponse } from 'msw';
import { cloneDeep } from 'lodash';
import hakemukset from '../../mocks/data/hakemukset-data';

test('Shows correct information when opened for excavation notification', async () => {
  const hakemus = cloneDeep(hakemukset[0]);
  render(<ApplicationSendDialog application={hakemus} isOpen={true} onClose={() => {}} />);

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
  const hakemus = cloneDeep(hakemukset[0]);
  render(<ApplicationSendDialog application={hakemus} isOpen={true} onClose={() => {}} />);

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
  const hakemus = cloneDeep(hakemukset[0]);
  render(<ApplicationSendDialog application={hakemus} isOpen={true} onClose={() => {}} />);

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
  const hakemus = cloneDeep(hakemukset[0]);
  const { user } = render(
    <ApplicationSendDialog application={hakemus} isOpen={true} onClose={() => {}} />,
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
  const hakemus = cloneDeep(hakemukset[0]);
  const { user } = render(
    <ApplicationSendDialog application={hakemus} isOpen={true} onClose={() => {}} />,
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

test('Sends the application when confirmed', async () => {
  const hakemus = cloneDeep(hakemukset[4]);
  let sent = false;
  server.use(
    http.post(`/api/hakemukset/:id/laheta`, async () => {
      hakemus.alluStatus = 'PENDING';
      sent = true;
      return HttpResponse.json(hakemus);
    }),
  );

  const { user } = render(
    <ApplicationSendDialog application={hakemus} isOpen={true} onClose={() => {}} />,
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
  expect(sent).toBe(true);
});

test('Shows error message when sending fails', async () => {
  server.use(
    http.post(`/api/hakemukset/:id/laheta`, async () => {
      return HttpResponse.json({ errorMessage: 'Failed for testing purposes' }, { status: 500 });
    }),
  );

  const hakemus = cloneDeep(hakemukset[4]);
  const { user } = render(
    <ApplicationSendDialog application={hakemus} isOpen={true} onClose={() => {}} />,
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
  expect(
    await screen.findByText(
      'Hakemuksen lähettäminen käsittelyyn epäonnistui. Yritä lähettämistä myöhemmin uudelleen tai ota yhteyttä Haitattoman tekniseen tukeen sähköpostiosoitteessa',
    ),
  ).toBeInTheDocument();
});

test('Calls onClose when cancelled', async () => {
  const hakemus = cloneDeep(hakemukset[4]);
  const onClose = jest.fn();
  const { user } = render(
    <ApplicationSendDialog application={hakemus} isOpen={true} onClose={onClose} />,
  );

  const cancelButton = screen.getByRole('button', { name: 'Peruuta' });
  await user.click(cancelButton);
  expect(onClose).toHaveBeenCalled();
});
