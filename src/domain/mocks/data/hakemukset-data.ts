import { Application, AlluStatus } from '../../application/types/application';

const hakemukset: Application[] = [
  {
    id: 1,
    alluStatus: null,
    applicationType: 'CABLE_REPORT',
    hankeTunnus: 'HAI22-2',
    applicationIdentifier: null,
    applicationData: {
      applicationType: 'CABLE_REPORT',
      name: 'Mannerheimintien kaivuut',
      customerWithContacts: {
        customer: {
          type: 'COMPANY',
          name: 'Yritys Oy',
          country: 'FI',
          email: 'yritys@test.com',
          phone: '0000000000',
          registryKey: '1164243-9',
          ovt: null,
          invoicingOperator: null,
          sapCustomerNumber: null,
        },
        contacts: [
          {
            hankekayttajaId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            email: 'matti.meikalainen@test.com',
            firstName: 'Matti',
            lastName: 'Meikäläinen',
            orderer: true,
            phone: '0401234567',
          },
        ],
      },
      areas: [
        {
          geometry: {
            type: 'Polygon',
            crs: {
              type: 'name',
              properties: {
                name: 'urn:ogc:def:crs:EPSG::3879',
              },
            },
            coordinates: [
              [
                [25498583.87, 6679281.28],
                [25498584.13, 6679314.07],
                [25498573.17, 6679313.38],
                [25498571.91, 6679281.46],
                [25498583.87, 6679281.28],
              ],
            ],
          },
        },
      ],
      startTime: new Date('2023-07-13T21:59:59.999Z'),
      endTime: new Date('2023-07-13T21:59:59.999Z'),
      workDescription: 'Kuvaus',
      contractorWithContacts: {
        customer: {
          type: 'COMPANY',
          name: 'Yritys 2 Oy',
          country: 'FI',
          email: 'yritys2@test.com',
          phone: '040123456',
          registryKey: null,
          ovt: null,
          invoicingOperator: null,
          sapCustomerNumber: null,
        },
        contacts: [
          {
            hankekayttajaId: '3fa85f64-5717-4562-b3fc-2c963f66afb1',
            email: 'tauno@test.com',
            firstName: 'Tauno',
            lastName: 'Testinen',
            orderer: false,
            phone: '0401234567',
          },
        ],
      },
      postalAddress: {
        city: 'Helsinki',
        postalCode: '00100',
        streetAddress: { streetName: 'Mannerheimintie 5' },
      },
      representativeWithContacts: null,
      propertyDeveloperWithContacts: null,
      constructionWork: true,
      maintenanceWork: false,
      emergencyWork: false,
      propertyConnectivity: false,
      rockExcavation: true,
    },
  },
  {
    id: 2,
    alluStatus: AlluStatus.PENDING,
    applicationType: 'CABLE_REPORT',
    hankeTunnus: 'HAI22-2',
    applicationIdentifier: 'JS2300001',
    applicationData: {
      applicationType: 'CABLE_REPORT',
      name: 'Mannerheimintien kuopat',
      customerWithContacts: {
        customer: {
          type: 'COMPANY',
          name: 'Yritys Oy',
          country: 'FI',
          email: 'yritys@test.com',
          phone: '0000000000',
          registryKey: '1164243-9',
          ovt: null,
          invoicingOperator: null,
          sapCustomerNumber: null,
        },
        contacts: [
          {
            hankekayttajaId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            email: 'matti.meikalainen@test.com',
            firstName: 'Matti',
            lastName: 'Meikäläinen',
            orderer: true,
            phone: '0401234567',
          },
        ],
      },
      areas: [
        {
          name: '',
          geometry: {
            coordinates: [
              [
                [25496600.4, 6672964.92],
                [25496623.43, 6672970.52],
                [25496648.96, 6672941.62],
                [25496646.75, 6672912.49],
                [25496623.66, 6672920.17],
                [25496600.4, 6672964.92],
              ],
            ],
            type: 'Polygon',
            crs: {
              type: 'Polygon',
              properties: {
                name: '',
              },
            },
          },
        },
      ],
      startTime: new Date('2023-07-13T21:59:59.999Z'),
      endTime: new Date('2023-09-31T21:59:59.999Z'),
      workDescription: 'Kaivetaan kuoppia Mannerheimintiellä',
      contractorWithContacts: {
        customer: {
          type: 'COMPANY',
          name: 'Yritys 2 Oy',
          country: 'FI',
          email: 'yritys2@test.com',
          phone: '0000000000',
          registryKey: '3227510-5',
          ovt: null,
          invoicingOperator: null,
          sapCustomerNumber: null,
        },
        contacts: [
          {
            email: 'matti@test.com',
            firstName: 'Matti',
            lastName: 'Meikäläinen',
            orderer: false,
            phone: '0000000000',
          },
        ],
      },
      postalAddress: {
        city: 'Helsinki',
        postalCode: '00100',
        streetAddress: { streetName: 'Mannerheimintie 5' },
      },
      representativeWithContacts: null,
      propertyDeveloperWithContacts: null,
      constructionWork: false,
      maintenanceWork: false,
      emergencyWork: true,
      propertyConnectivity: false,
      rockExcavation: false,
    },
  },
  {
    id: 3,
    alluStatus: AlluStatus.HANDLING,
    applicationType: 'CABLE_REPORT',
    hankeTunnus: 'HAI22-2',
    applicationIdentifier: 'JS2300002',
    applicationData: {
      applicationType: 'CABLE_REPORT',
      name: 'Mannerheimintien parantaminen',
      customerWithContacts: {
        customer: {
          type: 'PERSON',
          name: 'Kalle Kaivaja',
          country: 'FI',
          email: 'kalle@test.com',
          phone: '0000000000',
          registryKey: null,
          ovt: null,
          invoicingOperator: null,
          sapCustomerNumber: null,
        },
        contacts: [
          {
            hankekayttajaId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            email: 'matti.meikalainen@test.com',
            firstName: 'Matti',
            lastName: 'Meikäläinen',
            orderer: true,
            phone: '0401234567',
          },
        ],
      },
      areas: [],
      startTime: new Date('2023-07-13T21:59:59.999Z'),
      endTime: new Date('2023-09-31T21:59:59.999Z'),
      workDescription: 'Kaivetaan kuoppia Mannerheimintiellä',
      contractorWithContacts: {
        customer: {
          type: 'COMPANY',
          name: 'Yritys 2 Oy',
          country: 'FI',
          email: 'yritys2@test.com',
          phone: '0000000000',
          registryKey: '3227510-5',
          ovt: null,
          invoicingOperator: null,
          sapCustomerNumber: null,
        },
        contacts: [
          {
            hankekayttajaId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            email: 'matti.meikalainen@test.com',
            firstName: 'Matti',
            lastName: 'Meikäläinen',
            orderer: true,
            phone: '0401234567',
          },
        ],
      },
      postalAddress: {
        city: 'Helsinki',
        postalCode: '00100',
        streetAddress: { streetName: 'Mannerheimintie 5' },
      },
      representativeWithContacts: null,
      propertyDeveloperWithContacts: null,
      constructionWork: false,
      maintenanceWork: true,
      emergencyWork: false,
      propertyConnectivity: true,
      rockExcavation: true,
    },
  },
  {
    id: 4,
    alluStatus: AlluStatus.PENDING,
    applicationType: 'CABLE_REPORT',
    hankeTunnus: 'HAI22-3',
    applicationIdentifier: 'JS2300003',
    applicationData: {
      applicationType: 'CABLE_REPORT',
      name: 'Mannerheimintien kairaukset',
      customerWithContacts: {
        customer: {
          type: 'COMPANY',
          name: 'Yritys Oy',
          country: 'FI',
          email: 'yritys@test.com',
          phone: '0000000000',
          registryKey: '1234567-1',
          ovt: null,
          invoicingOperator: null,
          sapCustomerNumber: null,
        },
        contacts: [
          {
            hankekayttajaId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            email: 'matti.meikalainen@test.com',
            firstName: 'Matti',
            lastName: 'Meikäläinen',
            orderer: true,
            phone: '0401234567',
          },
        ],
      },
      areas: [
        {
          geometry: {
            coordinates: [
              [
                [25496600.4, 6672964.92],
                [25496623.43, 6672970.52],
                [25496648.96, 6672941.62],
                [25496646.75, 6672912.49],
                [25496623.66, 6672920.17],
                [25496600.4, 6672964.92],
              ],
            ],
            type: 'Polygon',
            crs: {
              type: 'Polygon',
              properties: {
                name: '',
              },
            },
          },
        },
      ],
      startTime: new Date('2023-06-13T21:59:59.999Z'),
      endTime: new Date('2023-10-15T21:59:59.999Z'),
      workDescription: 'Kairataan Mannerheimintiellä',
      contractorWithContacts: {
        customer: {
          type: 'COMPANY',
          name: 'Yritys 2 Oy',
          country: 'FI',
          email: 'yritys2@test.com',
          phone: '0000000000',
          registryKey: '1234567-1',
          ovt: null,
          invoicingOperator: null,
          sapCustomerNumber: null,
        },
        contacts: [
          {
            hankekayttajaId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            email: 'matti.meikalainen@test.com',
            firstName: 'Matti',
            lastName: 'Meikäläinen',
            orderer: true,
            phone: '0401234567',
          },
        ],
      },
      postalAddress: {
        city: 'Helsinki',
        postalCode: '00100',
        streetAddress: { streetName: 'Mannerheimintie 50' },
      },
      representativeWithContacts: null,
      propertyDeveloperWithContacts: null,
      constructionWork: true,
      maintenanceWork: false,
      emergencyWork: false,
      propertyConnectivity: false,
      rockExcavation: true,
    },
  },
];

export default hakemukset;
