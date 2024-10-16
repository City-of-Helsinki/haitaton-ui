import {
  getCurrentDecisions,
  getDecisionFilename,
  modifyDataAfterReceive,
  modifyDataBeforeSend,
} from './utils';
import hakemukset from '../mocks/data/hakemukset-data';
import { ContactType } from './types/application';
import { HIDDEN_FIELD_VALUE } from './constants';

describe('getCurrentDecisions', () => {
  test('returns all current decisions in correct order ', () => {
    const paatokset = hakemukset[9].paatokset;

    const currentDecisions = getCurrentDecisions(paatokset);

    expect(currentDecisions).toEqual([
      {
        id: 'f4b3b3b4-4b3b-4b3b-4b3b-4b3b4b3b4b3b',
        hakemusId: 8,
        hakemustunnus: 'KP2400002-2',
        tyyppi: 'TYO_VALMIS',
        tila: 'NYKYINEN',
        nimi: 'KI 2024-06-27',
        alkupaiva: new Date('2024-05-28'),
        loppupaiva: new Date('2024-05-31'),
        size: 35764,
      },
      {
        id: '59e202c4-7571-4b16-96d0-2945d689bedf',
        hakemusId: 8,
        hakemustunnus: 'KP2400002-2',
        tyyppi: 'TOIMINNALLINEN_KUNTO',
        tila: 'NYKYINEN',
        nimi: 'KI 2024-06-27',
        alkupaiva: new Date('2024-05-28'),
        loppupaiva: new Date('2024-05-31'),
        size: 35764,
      },
      {
        id: '6a24e4a6-8f87-4da7-96f9-5f6b54ea6834',
        hakemusId: 8,
        hakemustunnus: 'KP2400002-2',
        tyyppi: 'PAATOS',
        tila: 'NYKYINEN',
        nimi: 'KI 2024-06-27',
        alkupaiva: new Date('2024-05-28'),
        loppupaiva: new Date('2024-05-31'),
        size: 35764,
      },
    ]);
  });
});

describe('getDecisionFilename', () => {
  test('returns correct filename for decisions', () => {
    const paatokset = hakemukset[9].paatokset;
    const currentDecisions = getCurrentDecisions(paatokset);

    expect(getDecisionFilename(currentDecisions[0])).toEqual('KP2400002-2-tyo-valmis.pdf');
    expect(getDecisionFilename(currentDecisions[1])).toEqual(
      'KP2400002-2-toiminnallinen-kunto.pdf',
    );
    expect(getDecisionFilename(currentDecisions[2])).toEqual('KP2400002-2-paatos.pdf');
  });
});

describe('modifyDataBeforeSend', () => {
  test('does not change cable report application data', () => {
    const applicationData = hakemukset[0].applicationData;

    const modifiedApplicationData = modifyDataBeforeSend(applicationData);

    expect(modifiedApplicationData).toEqual(applicationData);
  });

  test('does not change excavation notification application data if customer type is not PERSON or OTHER', () => {
    const applicationData = hakemukset[6].applicationData;

    const modifiedApplicationData = modifyDataBeforeSend(applicationData);

    expect(modifiedApplicationData).toEqual(applicationData);
  });

  test.each([[ContactType.PERSON], [ContactType.OTHER]])(
    'nullifies registry key for customer if it is hidden',
    (contactType) => {
      const applicationData = {
        ...hakemukset[7].applicationData,
        customerWithContacts: {
          ...hakemukset[7].applicationData.customerWithContacts!,
          customer: {
            ...hakemukset[7].applicationData.customerWithContacts!.customer,
            type: contactType,
            registryKey: HIDDEN_FIELD_VALUE,
          },
        },
      };

      const modifiedApplicationData = modifyDataBeforeSend(applicationData);

      expect(modifiedApplicationData.customerWithContacts?.customer?.registryKey).toEqual(null);
      expect(modifiedApplicationData.customerWithContacts?.customer?.registryKeyHidden).toEqual(
        true,
      );
    },
  );

  test.each([[ContactType.PERSON], [ContactType.OTHER]])(
    'does not change registry key for customer if it is not hidden',
    (contactType) => {
      const applicationData = {
        ...hakemukset[7].applicationData,
        customerWithContacts: {
          ...hakemukset[7].applicationData.customerWithContacts!,
          customer: {
            ...hakemukset[7].applicationData.customerWithContacts!.customer,
            type: contactType,
            registryKey: '210495-170S',
            registryKeyHidden: false,
          },
        },
      };

      const modifiedApplicationData = modifyDataBeforeSend(applicationData);

      expect(modifiedApplicationData).toEqual(applicationData);
    },
  );

  test('does not change excavation notification application data if invoicing contact type is not PERSON or OTHER', () => {
    const applicationData = hakemukset[6].applicationData;

    const modifiedApplicationData = modifyDataBeforeSend(applicationData);

    expect(modifiedApplicationData).toEqual(applicationData);
  });

  test.each([[ContactType.PERSON], [ContactType.OTHER]])(
    'nullifies registry key for invoicing contact if it is hidden',
    (contactType) => {
      const applicationData = {
        ...hakemukset[7].applicationData,
        invoicingCustomer: {
          type: contactType,
          name: 'Laskutus',
          registryKey: HIDDEN_FIELD_VALUE,
          registryKeyHidden: false,
          postalAddress: {
            streetAddress: { streetName: 'Laskutuskuja 1' },
            postalCode: '00100',
            city: 'Helsinki',
          },
        },
      };

      const modifiedApplicationData = modifyDataBeforeSend(applicationData);

      expect(modifiedApplicationData.invoicingCustomer?.registryKey).toEqual(null);
      expect(modifiedApplicationData.invoicingCustomer?.registryKeyHidden).toEqual(true);
    },
  );

  test.each([[ContactType.PERSON], [ContactType.OTHER]])(
    'does not change registry key for invoicing contact if it is not hidden',
    (contactType) => {
      const applicationData = {
        ...hakemukset[7].applicationData,
        invoicingCustomer: {
          type: contactType,
          name: 'Laskutus',
          registryKey: '210495-170S',
          registryKeyHidden: false,
          postalAddress: {
            streetAddress: { streetName: 'Laskutuskuja 1' },
            postalCode: '00100',
            city: 'Helsinki',
          },
        },
      };

      const modifiedApplicationData = modifyDataBeforeSend(applicationData);

      expect(modifiedApplicationData).toEqual(applicationData);
    },
  );

  test('nullifies blank invoicing customer fields', () => {
    const applicationData = {
      ...hakemukset[7].applicationData,
      invoicingCustomer: {
        type: ContactType.PERSON,
        name: 'Laskutushenkilö',
        registryKey: null,
        registryKeyHidden: true,
        ovt: '',
        invoicingOperator: '',
        customerReference: '',
        postalAddress: {
          streetAddress: { streetName: 'Laskutuskuja 1' },
          postalCode: '00100',
          city: 'Helsinki',
        },
      },
    };

    const modifiedApplicationData = modifyDataBeforeSend(applicationData);

    expect(modifiedApplicationData.invoicingCustomer?.ovt).toBeNull();
    expect(modifiedApplicationData.invoicingCustomer?.invoicingOperator).toBeNull();
    expect(modifiedApplicationData.invoicingCustomer?.customerReference).toBeNull();
  });
});

describe('modifyDataAfterReceive', () => {
  test('does not change cable report application data', () => {
    const application = hakemukset[0];

    const modifiedApplication = modifyDataAfterReceive(application);

    expect(modifiedApplication).toEqual(application);
  });

  test('does not change excavation notification application data if customer type is not PERSON or OTHER', () => {
    const application = hakemukset[6];

    const modifiedApplication = modifyDataAfterReceive(application);

    expect(modifiedApplication).toEqual(application);
  });

  test.each([[ContactType.PERSON], [ContactType.OTHER]])(
    'masks registry key for customer if it is hidden',
    (contactType) => {
      const application = {
        ...hakemukset[7],
        applicationData: {
          ...hakemukset[7].applicationData,
          customerWithContacts: {
            ...hakemukset[7].applicationData.customerWithContacts!,
            customer: {
              ...hakemukset[7].applicationData.customerWithContacts!.customer,
              type: contactType,
              registryKey: null,
              registryKeyHidden: true,
            },
          },
        },
      };

      const modifiedApplication = modifyDataAfterReceive(application);

      expect(
        modifiedApplication.applicationData.customerWithContacts?.customer?.registryKey,
      ).toEqual(HIDDEN_FIELD_VALUE);
      expect(
        modifiedApplication.applicationData.customerWithContacts?.customer?.registryKeyHidden,
      ).toEqual(true);
    },
  );

  test('does not change excavation notification application data if invoicing contact type is not PERSON or OTHER', () => {
    const application = hakemukset[6];

    const modifiedApplication = modifyDataAfterReceive(application);

    expect(modifiedApplication).toEqual(application);
  });

  test.each([[ContactType.PERSON], [ContactType.OTHER]])(
    'masks registry key for invoicing contact if it is hidden',
    (contactType) => {
      const application = {
        ...hakemukset[7],
        applicationData: {
          ...hakemukset[7].applicationData,
          invoicingCustomer: {
            type: contactType,
            name: 'Laskutus',
            registryKey: null,
            registryKeyHidden: true,
            postalAddress: {
              streetAddress: { streetName: 'Laskutuskuja 1' },
              postalCode: '00100',
              city: 'Helsinki',
            },
          },
        },
      };

      const modifiedApplication = modifyDataAfterReceive(application);

      expect(modifiedApplication.applicationData.invoicingCustomer?.registryKey).toEqual(
        HIDDEN_FIELD_VALUE,
      );
      expect(modifiedApplication.applicationData.invoicingCustomer?.registryKeyHidden).toEqual(
        true,
      );
    },
  );
});
