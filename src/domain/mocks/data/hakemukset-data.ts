import {
  AlluStatus,
  Application,
  HankkeenHakemus,
  JohtoselvitysData,
  KaivuilmoitusData,
} from '../../application/types/application';
import { HAITTA_INDEX_TYPE } from '../../common/haittaIndexes/types';

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
          registryKeyHidden: false,
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
          registryKeyHidden: false,
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
  } as Application<JohtoselvitysData>,
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
          registryKeyHidden: false,
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
          registryKeyHidden: false,
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
  } as Application<JohtoselvitysData>,
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
          registryKeyHidden: false,
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
          registryKeyHidden: false,
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
  } as Application<JohtoselvitysData>,
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
          registryKeyHidden: false,
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
          registryKeyHidden: false,
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
  } as Application<JohtoselvitysData>,
  {
    id: 5,
    alluStatus: null,
    applicationType: 'EXCAVATION_NOTIFICATION',
    hankeTunnus: 'HAI22-2',
    applicationIdentifier: null,
    applicationData: {
      applicationType: 'EXCAVATION_NOTIFICATION',
      name: 'Aidasmäentien laajennetut kaivuut',
      startTime: new Date('2023-01-12T00:00:00Z'),
      endTime: new Date('2024-11-12T00:00:00Z'),
      workDescription: 'Kaivetaan Aidasmäentiellä',
      constructionWork: true,
      maintenanceWork: false,
      emergencyWork: false,
      propertyConnectivity: false,
      rockExcavation: false,
      cableReportDone: false,
      requiredCompetence: true,
      cableReports: ['JS2300002'],
      placementContracts: ['SL1234567'],
      areas: [
        {
          name: 'Hankealue 2',
          hankealueId: 2,
          tyoalueet: [
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
                    [25498585.50387858, 6679353.862125141],
                    [25498588.30930639, 6679372.671835153],
                    [25498578.30073113, 6679371.404998987],
                    [25498577.10224065, 6679355.728613365],
                    [25498585.50387858, 6679353.862125141],
                  ],
                ],
              },
              area: 158.4294946899533,
              tormaystarkasteluTulos: {
                liikennehaittaindeksi: {
                  indeksi: 3,
                  tyyppi: HAITTA_INDEX_TYPE.PYORALIIKENNEINDEKSI,
                },
                pyoraliikenneindeksi: 3,
                autoliikenne: {
                  indeksi: 1,
                  haitanKesto: 1,
                  katuluokka: 1,
                  liikennemaara: 1,
                  kaistahaitta: 1,
                  kaistapituushaitta: 1,
                },
                linjaautoliikenneindeksi: 1,
                raitioliikenneindeksi: 1,
              },
            },
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
                    [25498581.440262634, 6679345.526261961],
                    [25498582.233686976, 6679350.99321805],
                    [25498576.766730886, 6679351.786642391],
                    [25498575.973306544, 6679346.319686302],
                    [25498581.440262634, 6679345.526261961],
                  ],
                ],
              },
              area: 30.345726208334995,
              tormaystarkasteluTulos: {
                liikennehaittaindeksi: {
                  indeksi: 5,
                  tyyppi: HAITTA_INDEX_TYPE.RAITIOLIIKENNEINDEKSI,
                },
                pyoraliikenneindeksi: 1,
                autoliikenne: {
                  indeksi: 3,
                  haitanKesto: 3,
                  katuluokka: 3,
                  liikennemaara: 3,
                  kaistahaitta: 3,
                  kaistapituushaitta: 3,
                },
                linjaautoliikenneindeksi: 4,
                raitioliikenneindeksi: 5,
              },
            },
          ],
          katuosoite: 'Aidasmäentie 5',
          tyonTarkoitukset: ['VESI', 'VIEMARI'],
          meluhaitta: 'TOISTUVA_MELUHAITTA',
          polyhaitta: 'JATKUVA_POLYHAITTA',
          tarinahaitta: 'SATUNNAINEN_TARINAHAITTA',
          kaistahaitta: 'VAHENTAA_KAISTAN_YHDELLA_AJOSUUNNALLA',
          kaistahaittojenPituus: 'PITUUS_10_99_METRIA',
          lisatiedot: '',
        },
      ],
      customerWithContacts: null,
      contractorWithContacts: null,
      representativeWithContacts: null,
      propertyDeveloperWithContacts: null,
    },
  } as Application<KaivuilmoitusData>,
  {
    id: 6,
    alluStatus: AlluStatus.CANCELLED,
    applicationType: 'CABLE_REPORT',
    hankeTunnus: 'HAI22-4',
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
          registryKeyHidden: false,
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
          registryKeyHidden: false,
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
  } as Application<JohtoselvitysData>,
  {
    id: 7,
    alluStatus: null,
    applicationType: 'EXCAVATION_NOTIFICATION',
    hankeTunnus: 'HAI22-2',
    applicationIdentifier: null,
    applicationData: {
      applicationType: 'EXCAVATION_NOTIFICATION',
      name: 'Aidasmäentien toiset kaivuut',
      startTime: new Date('2023-01-12T00:00:00Z'),
      endTime: new Date('2024-11-12T00:00:00Z'),
      workDescription: 'Kaivetaan Aidasmäentiellä',
      constructionWork: true,
      maintenanceWork: false,
      emergencyWork: false,
      propertyConnectivity: false,
      rockExcavation: false,
      cableReportDone: false,
      requiredCompetence: true,
      cableReports: ['JS2300002'],
      placementContracts: ['SL1234567'],
      areas: [
        {
          name: 'Hankealue 2',
          hankealueId: 2,
          tyoalueet: [
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
                    [25498585.50387858, 6679353.862125141],
                    [25498588.30930639, 6679372.671835153],
                    [25498578.30073113, 6679371.404998987],
                    [25498577.10224065, 6679355.728613365],
                    [25498585.50387858, 6679353.862125141],
                  ],
                ],
              },
              area: 158.4294946899533,
            },
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
                    [25498581.440262634, 6679345.526261961],
                    [25498582.233686976, 6679350.99321805],
                    [25498576.766730886, 6679351.786642391],
                    [25498575.973306544, 6679346.319686302],
                    [25498581.440262634, 6679345.526261961],
                  ],
                ],
              },
              area: 30.345726208334995,
            },
          ],
          katuosoite: 'Aidasmäentie 5',
          tyonTarkoitukset: ['VESI'],
          meluhaitta: 'TOISTUVA_MELUHAITTA',
          polyhaitta: 'JATKUVA_POLYHAITTA',
          tarinahaitta: 'SATUNNAINEN_TARINAHAITTA',
          kaistahaitta: 'VAHENTAA_KAISTAN_YHDELLA_AJOSUUNNALLA',
          kaistahaittojenPituus: 'PITUUS_10_99_METRIA',
          lisatiedot: '',
        },
      ],
      customerWithContacts: {
        customer: {
          type: 'COMPANY',
          name: 'Yritys Oy',
          country: 'FI',
          email: 'yritys@test.com',
          phone: '0000000000',
          registryKey: '1164243-9',
          registryKeyHidden: false,
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
      contractorWithContacts: {
        customer: {
          type: 'COMPANY',
          name: 'Yritys 2 Oy',
          country: 'FI',
          email: 'yritys2@test.com',
          phone: '040123456',
          registryKey: '1234567-1',
          registryKeyHidden: false,
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
      representativeWithContacts: null,
      propertyDeveloperWithContacts: null,
      invoicingCustomer: {
        type: 'COMPANY',
        name: 'Laskutus Oy',
        registryKey: '1234567-1',
        registryKeyHidden: false,
        postalAddress: {
          streetAddress: { streetName: 'Laskutuskuja 1' },
          postalCode: '00100',
          city: 'Helsinki',
        },
      },
    },
  } as Application<KaivuilmoitusData>,
  {
    id: 8,
    alluStatus: 'FINISHED',
    applicationType: 'EXCAVATION_NOTIFICATION',
    hankeTunnus: 'HAI22-2',
    applicationIdentifier: 'KP2400001',
    applicationData: {
      applicationType: 'EXCAVATION_NOTIFICATION',
      name: 'Aidasmäentien viimeiset kaivuut',
      startTime: new Date('2023-01-12T00:00:00Z'),
      endTime: new Date('2024-11-12T00:00:00Z'),
      workDescription: 'Kaivetaan Aidasmäentiellä',
      constructionWork: true,
      maintenanceWork: false,
      emergencyWork: false,
      propertyConnectivity: false,
      rockExcavation: false,
      cableReportDone: false,
      requiredCompetence: true,
      cableReports: ['JS2300002'],
      placementContracts: ['SL1234567'],
      areas: [
        {
          name: 'Hankealue 2',
          hankealueId: 2,
          tyoalueet: [
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
                    [25498585.50387858, 6679353.862125141],
                    [25498588.30930639, 6679372.671835153],
                    [25498578.30073113, 6679371.404998987],
                    [25498577.10224065, 6679355.728613365],
                    [25498585.50387858, 6679353.862125141],
                  ],
                ],
              },
              area: 158.4294946899533,
            },
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
                    [25498581.440262634, 6679345.526261961],
                    [25498582.233686976, 6679350.99321805],
                    [25498576.766730886, 6679351.786642391],
                    [25498575.973306544, 6679346.319686302],
                    [25498581.440262634, 6679345.526261961],
                  ],
                ],
              },
              area: 30.345726208334995,
            },
          ],
          katuosoite: 'Aidasmäentie 5',
          tyonTarkoitukset: ['VESI'],
          meluhaitta: 'TOISTUVA_MELUHAITTA',
          polyhaitta: 'JATKUVA_POLYHAITTA',
          tarinahaitta: 'SATUNNAINEN_TARINAHAITTA',
          kaistahaitta: 'VAHENTAA_KAISTAN_YHDELLA_AJOSUUNNALLA',
          kaistahaittojenPituus: 'PITUUS_10_99_METRIA',
          lisatiedot: '',
        },
      ],
      customerWithContacts: {
        customer: {
          type: 'COMPANY',
          name: 'Yritys Oy',
          country: 'FI',
          email: 'yritys@test.com',
          phone: '0000000000',
          registryKey: '1164243-9',
          registryKeyHidden: false,
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
      contractorWithContacts: {
        customer: {
          type: 'COMPANY',
          name: 'Yritys 2 Oy',
          country: 'FI',
          email: 'yritys2@test.com',
          phone: '040123456',
          registryKey: null,
          registryKeyHidden: false,
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
      representativeWithContacts: null,
      propertyDeveloperWithContacts: null,
      invoicingCustomer: {
        type: 'COMPANY',
        name: 'Laskutus Oy',
        registryKey: '1234567-1',
        registryKeyHidden: false,
        postalAddress: {
          streetAddress: { streetName: 'Laskutuskuja 1' },
          postalCode: '00100',
          city: 'Helsinki',
        },
      },
      paperDecisionReceiver: {
        name: 'Pekka Paperinen',
        streetAddress: 'Paperipolku 3 A 4',
        postalCode: '00451',
        city: 'Helsinki',
      },
    },
    paatokset: {
      KP2400001: [
        {
          id: '4567652f-85fd-4ae1-b7f0-1694a93bddaa',
          hakemusId: 8,
          hakemustunnus: 'KP2400001',
          tyyppi: 'TOIMINNALLINEN_KUNTO',
          tila: 'KORVATTU',
          nimi: 'KI 2024-06-27',
          alkupaiva: new Date('2024-05-28'),
          loppupaiva: new Date('2024-05-31'),
          size: 35764,
        },
        {
          id: '404e0300-db95-4c65-9d27-eff8930fef23',
          hakemusId: 8,
          hakemustunnus: 'KP2400001',
          tyyppi: 'PAATOS',
          tila: 'KORVATTU',
          nimi: 'KI 2024-06-27',
          alkupaiva: new Date('2024-05-28'),
          loppupaiva: new Date('2024-05-31'),
          size: 35764,
        },
      ],
      'KP240001-2': [
        {
          id: '6a24e4a6-8f87-4da7-96f9-5f6b54ea6834',
          hakemusId: 8,
          hakemustunnus: 'KP2400001-2',
          tyyppi: 'PAATOS',
          tila: 'NYKYINEN',
          nimi: 'KI 2024-06-27',
          alkupaiva: new Date('2024-05-28'),
          loppupaiva: new Date('2024-05-31'),
          size: 35764,
        },
        {
          id: '59e202c4-7571-4b16-96d0-2945d689bedf',
          hakemusId: 8,
          hakemustunnus: 'KP2400001-2',
          tyyppi: 'TOIMINNALLINEN_KUNTO',
          tila: 'NYKYINEN',
          nimi: 'KI 2024-06-27',
          alkupaiva: new Date('2024-05-28'),
          loppupaiva: new Date('2024-05-31'),
          size: 35764,
        },
        {
          id: 'f4b3b3b4-4b3b-4b3b-4b3b-4b3b4b3b4b3b',
          hakemusId: 8,
          hakemustunnus: 'KP2400001-2',
          tyyppi: 'TYO_VALMIS',
          tila: 'NYKYINEN',
          nimi: 'KI 2024-06-27',
          alkupaiva: new Date('2024-05-28'),
          loppupaiva: new Date('2024-05-31'),
          size: 35764,
        },
      ],
    },
    valmistumisilmoitukset: {
      TOIMINNALLINEN_KUNTO: [
        {
          type: 'TOIMINNALLINEN_KUNTO',
          dateReported: new Date('2024-08-01'),
          reportedAt: new Date('2024-08-01T15:15:15Z'),
        },
      ],
      TYO_VALMIS: [
        {
          type: 'TYO_VALMIS',
          dateReported: new Date('2024-08-01'),
          reportedAt: new Date('2024-08-01T15:15:15Z'),
        },
      ],
    },
  } as Application<KaivuilmoitusData>,
  {
    id: 9,
    alluStatus: AlluStatus.DECISION,
    applicationType: 'CABLE_REPORT',
    hankeTunnus: 'HAI22-2',
    applicationIdentifier: 'JS2300002',
    applicationData: {
      applicationType: 'CABLE_REPORT',
      name: 'Mannerheimintien vanha parantaminen',
      customerWithContacts: {
        customer: {
          type: 'PERSON',
          name: 'Kalle Kaivaja',
          country: 'FI',
          email: 'kalle@test.com',
          phone: '0000000000',
          registryKey: null,
          registryKeyHidden: true,
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
          registryKeyHidden: false,
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
      paperDecisionReceiver: {
        name: 'Pekka Paperinen',
        streetAddress: 'Paperipolku 3 A 4',
        postalCode: '00451',
        city: 'Helsinki',
      },
    },
  } as Application<JohtoselvitysData>,
];

export default hakemukset;

export const hankkeenHakemukset: HankkeenHakemus[] = hakemukset
  .filter((hakemus) => hakemus.hankeTunnus === 'HAI22-2')
  .map((hakemus) => {
    return {
      id: hakemus.id,
      alluid: hakemus.alluid,
      alluStatus: hakemus.alluStatus,
      applicationIdentifier: hakemus.applicationIdentifier,
      applicationType: hakemus.applicationType,
      applicationData: {
        name: hakemus.applicationData.name,
        startTime: hakemus.applicationData.startTime,
        endTime: hakemus.applicationData.endTime,
        pendingOnClient: hakemus.alluStatus === AlluStatus.PENDING_CLIENT,
      },
      paatokset: hakemus.paatokset,
    };
  });
