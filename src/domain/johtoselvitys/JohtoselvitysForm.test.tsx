import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, cleanup, fireEvent, screen } from '../../testUtils/render';
import Johtoselvitys from '../../pages/Johtoselvitys';
import { waitForLoadingToFinish } from '../../testUtils/helperFunctions';

afterEach(cleanup);

jest.setTimeout(30000);

test('Cable report application form can be filled and saved and sent to Allu', async () => {
  const user = userEvent.setup();

  render(<Johtoselvitys />, undefined, '/fi/johtoselvityshakemus?hanke=HAI22-2');

  await waitForLoadingToFinish();

  expect(
    screen.queryByText('Aidasmäentien vesihuollon rakentaminen (HAI22-2)')
  ).toBeInTheDocument();

  // Fill basic information page
  fireEvent.change(screen.getByLabelText(/työn nimi/i), {
    target: { value: 'Johtoselvitys' },
  });

  fireEvent.change(screen.getAllByLabelText(/katuosoite/i)[0], {
    target: { value: 'Mannerheimintie 5' },
  });
  fireEvent.change(screen.getAllByLabelText(/postinumero/i)[0], {
    target: { value: '00100' },
  });
  fireEvent.change(screen.getAllByLabelText(/postitoimipaikka/i)[0], {
    target: { value: 'Helsinki' },
  });

  fireEvent.click(screen.getByLabelText(/uuden rakenteen tai johdon rakentamisesta/i));

  fireEvent.change(screen.getByLabelText(/työn kuvaus/i), {
    target: { value: 'Testataan johtoselvityslomaketta' },
  });

  fireEvent.change(screen.getByLabelText(/Nimi/), {
    target: { value: 'Matti Meikäläinen' },
  });
  fireEvent.change(screen.getByLabelText(/sähköposti/i), {
    target: { value: 'matti.meikalainen@test.com' },
  });
  fireEvent.change(screen.getByLabelText(/puhelinnumero/i), {
    target: { value: '0000000000' },
  });

  // Move to areas page
  await user.click(screen.getByRole('button', { name: /seuraava/i }));

  expect(screen.queryByText(/hakemus tallennettu/i)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /sulje ilmoitus/i }));

  expect(screen.queryByText('Vaihe 2/4: Alueet')).toBeInTheDocument();

  // Fill areas page
  fireEvent.change(screen.getByLabelText(/työn arvioitu alkupäivä/i), {
    target: { value: '1.4.2024' },
  });
  fireEvent.change(screen.getByLabelText(/työn arvioitu loppupäivä/i), {
    target: { value: '1.6.2024' },
  });

  // Move to contacts page
  await user.click(screen.getByRole('button', { name: /seuraava/i }));

  expect(screen.queryByText(/hakemus tallennettu/i)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /sulje ilmoitus/i }));

  expect(screen.queryByText('Vaihe 3/4: Yhteystiedot')).toBeInTheDocument();

  // Fill contacts page

  // Fill customer info
  await user.click(screen.getAllByRole('button', { name: /tyyppi/i })[0]);
  await user.click(screen.getAllByText(/yritys/i)[0]);
  fireEvent.change(screen.getAllByLabelText('Nimi *')[0], {
    target: { value: 'Yritys Oy' },
  });
  fireEvent.change(screen.getAllByLabelText(/y-tunnus tai henkilötunnus/i)[0], {
    target: { value: 'y-tunnus' },
  });
  fireEvent.change(screen.getAllByLabelText(/sähköposti/i)[0], {
    target: { value: 'yritys@test.com' },
  });
  fireEvent.change(screen.getAllByLabelText(/puhelinnumero/i)[0], {
    target: { value: '0000000000' },
  });

  // Fill contractor info
  await user.click(screen.getAllByRole('button', { name: /tyyppi/i })[1]);
  await user.click(screen.getAllByText(/yritys/i)[1]);
  fireEvent.change(screen.getAllByLabelText('Nimi *')[2], {
    target: { value: 'Yritys 2 Oy' },
  });
  fireEvent.change(screen.getAllByLabelText(/y-tunnus tai henkilötunnus/i)[1], {
    target: { value: 'y-tunnus2' },
  });
  fireEvent.change(screen.getAllByLabelText(/sähköposti/i)[2], {
    target: { value: 'yritys2@test.com' },
  });
  fireEvent.change(screen.getAllByLabelText(/puhelinnumero/i)[2], {
    target: { value: '0000000000' },
  });

  // Fill contact of contractor
  fireEvent.change(screen.getAllByLabelText('Nimi *')[3], {
    target: { value: 'Alli Asiakas' },
  });
  fireEvent.change(screen.getAllByLabelText(/sähköposti/i)[3], {
    target: { value: 'alli.asiakas@test.com' },
  });
  fireEvent.change(screen.getAllByLabelText(/puhelinnumero/i)[3], {
    target: { value: '0000000000' },
  });

  // Move to summary page
  await user.click(screen.getByRole('button', { name: /seuraava/i }));

  expect(screen.queryByText(/hakemus tallennettu/i)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /sulje ilmoitus/i }));

  expect(screen.queryByText('Vaihe 4/4: Yhteenveto')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: /lähetä hakemus/i }));
  expect(screen.queryByText(/Hakemus lähetetty/i)).toBeInTheDocument();
});