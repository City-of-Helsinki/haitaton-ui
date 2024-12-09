import { render, screen } from '../../../testUtils/render';
import TaydennyspyyntoNotification from './TaydennyspyyntoNotification';
import { TaydennyspyyntoFieldKey } from './types';
import i18next from '../../../locales/i18nForTests';
import { sortTaydennyspyyntoFields } from './utils';

describe('TaydennyspyyntoNotification', () => {
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

  test('Should render correct information for taydennyspyynto for a cable report', () => {
    render(
      <TaydennyspyyntoNotification
        taydennyspyynto={taydennyspyynto}
        applicationType={'CABLE_REPORT'}
      />,
    );

    expect(screen.getByText('Täydennyspyyntö')).toBeInTheDocument();
    expect(screen.getByText('Muokkaa hakemusta korjataksesi seuraavat asiat:')).toBeInTheDocument();
    expect(screen.getByText('Työn arvioitu alkupäivä')).toBeInTheDocument();
    expect(screen.getByText('Työn arvioitu loppupäivä')).toBeInTheDocument();
    const items = screen.getAllByRole('listitem');
    taydennyspyynto.kentat.toSorted(sortTaydennyspyyntoFields).forEach((kentta, index) => {
      const label = i18next.t(`taydennyspyynto:fields:CABLE_REPORT:${kentta.key}`);
      expect(items[index]).toHaveTextContent(`${label}: ${kentta.message}`);
    });
  });

  test('Should render correct information for taydennyspyynto for an excavation notification', () => {
    render(
      <TaydennyspyyntoNotification
        taydennyspyynto={taydennyspyynto}
        applicationType={'EXCAVATION_NOTIFICATION'}
      />,
    );

    expect(screen.getByText('Täydennyspyyntö')).toBeInTheDocument();
    expect(screen.getByText('Muokkaa hakemusta korjataksesi seuraavat asiat:')).toBeInTheDocument();
    expect(screen.getByText('Työn alkupäivämäärä')).toBeInTheDocument();
    expect(screen.getByText('Työn loppupäivämäärä')).toBeInTheDocument();
    const items = screen.getAllByRole('listitem');
    taydennyspyynto.kentat.toSorted(sortTaydennyspyyntoFields).forEach((kentta, index) => {
      const label = i18next.t(`taydennyspyynto:fields:EXCAVATION_NOTIFICATION:${kentta.key}`);
      expect(items[index]).toHaveTextContent(`${label}: ${kentta.message}`);
    });
  });
});
