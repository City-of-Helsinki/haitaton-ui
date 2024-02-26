import { ApplicationType } from '../../application/types/application';

export const defaultJohtoselvitysData = {
  applicationType: 'CABLE_REPORT' as ApplicationType,
  workDescription: '',
  startTime: null,
  endTime: null,
  areas: [],
  constructionWork: false,
  maintenanceWork: false,
  emergencyWork: false,
  propertyConnectivity: false,
  rockExcavation: null,
  postalAddress: { streetAddress: { streetName: '' }, city: '', postalCode: '' },
  representativeWithContacts: null,
  propertyDeveloperWithContacts: null,
  customerWithContacts: {
    customer: {
      type: null,
      name: '',
      country: 'FI',
      email: '',
      phone: '',
      registryKey: null,
      ovt: null,
      invoicingOperator: null,
      sapCustomerNumber: null,
    },
    contacts: [
      {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        orderer: true,
      },
    ],
  },
  contractorWithContacts: {
    customer: {
      type: null,
      name: '',
      country: 'FI',
      email: '',
      phone: '',
      registryKey: null,
      ovt: null,
      invoicingOperator: null,
      sapCustomerNumber: null,
    },
    contacts: [
      {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        orderer: false,
      },
    ],
  },
};
