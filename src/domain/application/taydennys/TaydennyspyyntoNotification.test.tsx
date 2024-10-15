import { render, screen } from '../../../testUtils/render';
import TaydennyspyyntoNotification from './TaydennyspyyntoNotification';
import { TaydennyspyyntoFieldKey } from './types';
import i18next from '../../../locales/i18nForTests';

describe('TaydennyspyyntoNotification', () => {
  test('Should render correct information for taydennyspyynto', () => {
    const taydennyspyynto = {
      id: 'c0a1fe7b-326c-4b25-a7bc-d1797762c01c',
      kentat: [
        {
          key: TaydennyspyyntoFieldKey.PROPERTY_DEVELOPER,
          message: 'Virheellinen sähköpostiosoite',
        },
        {
          key: TaydennyspyyntoFieldKey.CUSTOMER,
          message: 'Anna kokonainen sukunimi',
        },
        {
          key: TaydennyspyyntoFieldKey.AREA,
          message: 'Pinta-ala ei täsmää alueen kanssa',
        },
        {
          key: TaydennyspyyntoFieldKey.REPRESENTATIVE,
          message: 'Virheellinen sähköpostiosoite',
        },
        {
          key: TaydennyspyyntoFieldKey.START_TIME,
          message: 'Korjaa aloituspäivämäärää',
        },
        {
          key: TaydennyspyyntoFieldKey.END_TIME,
          message: 'Korjaa lopetuspäivämäärää',
        },
        {
          key: TaydennyspyyntoFieldKey.IDENTIFICATION_NUMBER,
          message: 'Virheellinen asiointitunnus',
        },
        {
          key: TaydennyspyyntoFieldKey.INVOICING_CUSTOMER,
          message: 'Sähköpostiosoite puuttuu',
        },
        {
          key: TaydennyspyyntoFieldKey.POSTAL_ADDRESS,
          message: 'Korjaa osoite',
        },
        {
          key: TaydennyspyyntoFieldKey.WORK_DESCRIPTION,
          message: 'Tarkenna työn kuvausta',
        },
        {
          key: TaydennyspyyntoFieldKey.PROPERTY_IDENTIFICATION_NUMBER,
          message: 'Korjaa kiinteistötunnus',
        },
        {
          key: TaydennyspyyntoFieldKey.GEOMETRY,
          message: 'Korjaa karttarajausta',
        },
        {
          key: TaydennyspyyntoFieldKey.CONTRACTOR,
          message: 'Virheellinen sähköpostiosoite',
        },
        {
          key: TaydennyspyyntoFieldKey.ATTACHMENT,
          message: 'Liikennejärjestelysuunnitelma ja valtakirja työstä vastaavalta puuttuu',
        },
        {
          key: TaydennyspyyntoFieldKey.OTHER,
          message: 'Korjaa myös liikennejärjestelytekstiä',
        },
      ],
    };
    render(<TaydennyspyyntoNotification taydennyspyynto={taydennyspyynto} />);

    expect(screen.getByText('Täydennyspyyntö')).toBeInTheDocument();
    expect(screen.getByText('Muokkaa hakemusta korjataksesi seuraavat asiat:')).toBeInTheDocument();
    taydennyspyynto.kentat.forEach((kentta, index) => {
      const label = i18next.t(`taydennyspyynto:fields:${kentta.key}`);
      expect(screen.getAllByRole('listitem')[index]).toHaveTextContent(
        `${label}: ${kentta.message}`,
      );
    });
  });
});
