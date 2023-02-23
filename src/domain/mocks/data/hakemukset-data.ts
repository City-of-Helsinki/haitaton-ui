import { Application, AlluStatus } from '../../application/types/application';

const hakemukset: Application[] = [
  {
    id: 1,
    alluStatus: null,
    applicationType: 'CABLE_REPORT',
    applicationData: {
      hankeTunnus: 'HAI22-2',
      applicationType: 'CABLE_REPORT',
      name: 'Mannerheimintien kaivuut',
      customerWithContacts: {
        customer: {
          type: 'COMPANY',
          name: 'Yritys Oy',
          country: 'FI',
          postalAddress: {
            streetAddress: {
              streetName: '',
            },
            postalCode: '',
            city: '',
          },
          email: 'yritys@test.com',
          phone: '0000000000',
          registryKey: '',
          ovt: null,
          invoicingOperator: null,
          sapCustomerNumber: null,
        },
        contacts: [
          {
            email: 'matti@test.com',
            name: 'Matti Meikäläinen',
            orderer: true,
            phone: '0000000000',
            postalAddress: { city: '', postalCode: '', streetAddress: { streetName: '' } },
          },
        ],
      },
      geometry: {
        type: 'GeometryCollection',
        crs: {
          type: 'name',
          properties: {
            name: 'EPSG:3879',
          },
        },
        geometries: [],
      },
      startTime: null,
      endTime: null,
      identificationNumber: 'HAI-123',
      clientApplicationKind: 'HAITATON',
      workDescription: '',
      contractorWithContacts: {
        customer: {
          type: null,
          name: '',
          country: 'FI',
          postalAddress: {
            streetAddress: {
              streetName: '',
            },
            postalCode: '',
            city: '',
          },
          email: '',
          phone: '',
          registryKey: '',
          ovt: null,
          invoicingOperator: null,
          sapCustomerNumber: null,
        },
        contacts: [
          {
            email: '',
            name: '',
            orderer: false,
            phone: '',
            postalAddress: { city: '', postalCode: '', streetAddress: { streetName: '' } },
          },
        ],
      },
      postalAddress: {
        city: 'Helsinki',
        postalCode: '00100',
        streetAddress: { streetName: 'Mannerheimintie 5' },
      },
      representativeWithContacts: null,
      invoicingCustomer: null,
      customerReference: null,
      area: null,
      propertyDeveloperWithContacts: null,
      constructionWork: false,
      maintenanceWork: false,
      emergencyWork: false,
      propertyConnectivity: false,
    },
  },
  {
    id: 2,
    alluStatus: AlluStatus.PENDING,
    applicationType: 'CABLE_REPORT',
    applicationData: {
      hankeTunnus: 'HAI22-2',
      applicationType: 'CABLE_REPORT',
      name: 'Mannerheimintien kuopat',
      customerWithContacts: {
        customer: {
          type: 'COMPANY',
          name: 'Yritys Oy',
          country: 'FI',
          postalAddress: {
            streetAddress: {
              streetName: '',
            },
            postalCode: '',
            city: '',
          },
          email: 'yritys@test.com',
          phone: '0000000000',
          registryKey: '',
          ovt: null,
          invoicingOperator: null,
          sapCustomerNumber: null,
        },
        contacts: [
          {
            email: 'matti@test.com',
            name: 'Matti Meikäläinen',
            orderer: true,
            phone: '0000000000',
            postalAddress: { city: '', postalCode: '', streetAddress: { streetName: '' } },
          },
        ],
      },
      geometry: {
        type: 'GeometryCollection',
        crs: {
          type: 'name',
          properties: {
            name: 'EPSG:3879',
          },
        },
        geometries: [],
      },
      startTime: '2023-07-13T21:59:59.999Z',
      endTime: '2023-09-31T21:59:59.999Z',
      identificationNumber: 'HAI-123',
      clientApplicationKind: 'HAITATON',
      workDescription: 'Kaivetaan kuoppia Mannerheimintiellä',
      contractorWithContacts: {
        customer: {
          type: 'COMPANY',
          name: 'Yritys 2 Oy',
          country: 'FI',
          postalAddress: {
            streetAddress: {
              streetName: '',
            },
            postalCode: '',
            city: '',
          },
          email: 'yritys2@test.com',
          phone: '0000000000',
          registryKey: '',
          ovt: null,
          invoicingOperator: null,
          sapCustomerNumber: null,
        },
        contacts: [
          {
            email: 'matti@test.com',
            name: 'Matti Meikäläinen',
            orderer: true,
            phone: '0000000000',
            postalAddress: { city: '', postalCode: '', streetAddress: { streetName: '' } },
          },
        ],
      },
      postalAddress: {
        city: 'Helsinki',
        postalCode: '00100',
        streetAddress: { streetName: 'Mannerheimintie 5' },
      },
      representativeWithContacts: null,
      invoicingCustomer: null,
      customerReference: null,
      area: null,
      propertyDeveloperWithContacts: null,
      constructionWork: false,
      maintenanceWork: false,
      emergencyWork: false,
      propertyConnectivity: false,
    },
  },
  {
    id: 3,
    alluStatus: AlluStatus.HANDLING,
    applicationType: 'CABLE_REPORT',
    applicationData: {
      hankeTunnus: 'HAI22-2',
      applicationType: 'CABLE_REPORT',
      name: 'Mannerheimintien kuopat',
      customerWithContacts: {
        customer: {
          type: 'COMPANY',
          name: 'Yritys Oy',
          country: 'FI',
          postalAddress: {
            streetAddress: {
              streetName: '',
            },
            postalCode: '',
            city: '',
          },
          email: 'yritys@test.com',
          phone: '0000000000',
          registryKey: '',
          ovt: null,
          invoicingOperator: null,
          sapCustomerNumber: null,
        },
        contacts: [
          {
            email: 'matti@test.com',
            name: 'Matti Meikäläinen',
            orderer: true,
            phone: '0000000000',
            postalAddress: { city: '', postalCode: '', streetAddress: { streetName: '' } },
          },
        ],
      },
      geometry: {
        type: 'GeometryCollection',
        crs: {
          type: 'name',
          properties: {
            name: 'EPSG:3879',
          },
        },
        geometries: [],
      },
      startTime: '2023-07-13T21:59:59.999Z',
      endTime: '2023-09-31T21:59:59.999Z',
      identificationNumber: 'HAI-123',
      clientApplicationKind: 'HAITATON',
      workDescription: 'Kaivetaan kuoppia Mannerheimintiellä',
      contractorWithContacts: {
        customer: {
          type: 'COMPANY',
          name: 'Yritys 2 Oy',
          country: 'FI',
          postalAddress: {
            streetAddress: {
              streetName: '',
            },
            postalCode: '',
            city: '',
          },
          email: 'yritys2@test.com',
          phone: '0000000000',
          registryKey: '',
          ovt: null,
          invoicingOperator: null,
          sapCustomerNumber: null,
        },
        contacts: [
          {
            email: 'matti@test.com',
            name: 'Matti Meikäläinen',
            orderer: true,
            phone: '0000000000',
            postalAddress: { city: '', postalCode: '', streetAddress: { streetName: '' } },
          },
        ],
      },
      postalAddress: {
        city: 'Helsinki',
        postalCode: '00100',
        streetAddress: { streetName: 'Mannerheimintie 5' },
      },
      representativeWithContacts: null,
      invoicingCustomer: null,
      customerReference: null,
      area: null,
      propertyDeveloperWithContacts: null,
      constructionWork: false,
      maintenanceWork: false,
      emergencyWork: false,
      propertyConnectivity: false,
    },
  },
];

export default hakemukset;
