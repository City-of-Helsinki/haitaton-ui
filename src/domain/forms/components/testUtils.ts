import { fireEvent, screen } from '@testing-library/dom';

export function fillNewContactPersonForm(
  options: {
    etunimi?: string;
    sukunimi?: string;
    sahkoposti?: string;
    puhelinnumero?: string;
  } = {},
) {
  const {
    etunimi = 'Matti',
    sukunimi = 'Meikäläinen',
    sahkoposti = 'matti.meikalainen@test.com',
    puhelinnumero = '0401234567',
  } = options;
  fireEvent.change(screen.getByLabelText(/etunimi/i), {
    target: { value: etunimi },
  });
  fireEvent.change(screen.getByLabelText(/sukunimi/i), {
    target: { value: sukunimi },
  });
  fireEvent.change(screen.getAllByRole('textbox', { name: /sähköposti/i })[1], {
    target: { value: sahkoposti },
  });
  fireEvent.change(screen.getAllByRole('textbox', { name: /puhelin/i })[1], {
    target: { value: puhelinnumero },
  });
}
