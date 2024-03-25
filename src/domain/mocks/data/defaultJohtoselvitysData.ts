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
  customerWithContacts: null,
  contractorWithContacts: null,
};
