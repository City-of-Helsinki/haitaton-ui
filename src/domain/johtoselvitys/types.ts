import { HaitatonGeometry } from '../../common/types/hanke';

export type ApplicationType = 'CABLE_REPORT';

export type PostalAddress = {
  streetAddress: {
    streetName: string;
  };
  postalCode: string;
  city: string;
};

export type Contact = {
  name: string;
  postalAddress: PostalAddress;
  email: string;
  phone: string;
  orderer: boolean;
};

export enum ContactType {
  PERSON = 'PERSON',
  COMPANY = 'COMPANY',
  ASSOCIATION = 'ASSOCIATION',
  OTHER = 'OTHER',
}

export type CustomerType =
  | 'customerWithContacts'
  | 'contractorWithContacts'
  | 'propertyDeveloperWithContacts'
  | 'representativeWithContacts';

export type Customer = {
  type: keyof typeof ContactType | null;
  name: string;
  country: string;
  postalAddress: PostalAddress;
  email: string;
  phone: string;
  registryKey: string;
  ovt: string | null;
  invoicingOperator: string | null;
  sapCustomerNumber: string | null;
};

export type CustomerWithContacts = {
  customer: Customer;
  contacts: Contact[];
};

export type JohtoselvitysFormData = {
  hankeTunnus: string;
  applicationType: ApplicationType;
  name: string;
  customerWithContacts: CustomerWithContacts;
  contractorWithContacts: CustomerWithContacts;
  geometry: HaitatonGeometry;
  startTime: string | null;
  endTime: string | null;
  pendingOnClient: boolean;
  identificationNumber: string; // hankeTunnus
  clientApplicationKind: string;
  workDescription: string;
  postalAddress: PostalAddress | null;
  representativeWithContacts: CustomerWithContacts | null;
  invoicingCustomer: null;
  customerReference: null;
  area: null;
  propertyDeveloperWithContacts: CustomerWithContacts | null;
  constructionWork: boolean;
  maintenanceWork: boolean;
  emergencyWork: boolean;
  propertyConnectivity: boolean;
};

export interface JohtoselvitysFormValues {
  id: number | null;
  applicationType: ApplicationType;
  applicationData: JohtoselvitysFormData;
}
