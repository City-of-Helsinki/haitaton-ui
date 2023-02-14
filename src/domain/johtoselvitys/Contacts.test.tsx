/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';
import { render, screen } from '../../testUtils/render';
import { Contacts } from './Contacts';
import hankkeet from '../mocks/data/hankkeet-data';
import { HankeContact, HankeDataDraft } from '../types/hanke';

jest.setTimeout(10000);

function Form({ hanke }: { hanke: HankeDataDraft }) {
  const methods = useForm({});

  const hankeContacts = [hanke.omistajat, hanke.rakennuttajat, hanke.toteuttajat, hanke.muut];

  return (
    <FormProvider {...methods}>
      <Contacts hankeContacts={hankeContacts} />
    </FormProvider>
  );
}

test('Contacts can be filled with hanke contact info', async () => {
  const user = userEvent.setup();

  const hanke = hankkeet[1];
  const hankeOwner: HankeContact = hanke.omistajat![0];

  render(<Form hanke={hanke} />);

  // Select applicant information to be filled with hanke owner information
  await user.click(screen.getAllByRole('button', { name: /esitäytetyt tiedot/i, exact: false })[0]);
  await user.click(screen.getByText(hankeOwner.nimi));

  expect(screen.getAllByRole('button', { name: /tyyppi/i })[0]).toHaveTextContent('Yritys');
  expect(screen.getAllByRole('textbox', { name: /nimi/i })[0]).toHaveValue(hankeOwner.nimi);
  expect(screen.getAllByRole('textbox', { name: /Y-tunnus tai henkilötunnus/i })[0]).toHaveValue(
    hankeOwner.ytunnusTaiHetu
  );
  expect(screen.getAllByRole('textbox', { name: /katuosoite/i })[0]).toHaveValue(
    hankeOwner.osoite!
  );
  expect(screen.getAllByRole('textbox', { name: /postinumero/i })[0]).toHaveValue(
    hankeOwner.postinumero!
  );
  expect(screen.getAllByRole('textbox', { name: /postitoimipaikka/i })[0]).toHaveValue(
    hankeOwner.postitoimipaikka!
  );
  expect(screen.getAllByRole('textbox', { name: /sähköposti/i })[0]).toHaveValue(hankeOwner.email);
  expect(screen.getAllByRole('textbox', { name: /puhelinnumero/i })[0]).toHaveValue(
    hankeOwner.puhelinnumero
  );
});
