import { HaitatonGeometry } from '../../common/types/hanke';

export type ApplicationType = 'CABLE_APPLICATION';

export type Contact = {
  name: string;
  postalAddress: {
    streetAddress: {
      streetName: string;
    };
    postalCode: string;
    city: string;
  };
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

export type Customer = {
  type: ContactType | '';
  name: string;
  country: string;
  postalAddress: {
    streetAddress: {
      streetName: string;
    };
    postalCode: string;
    city: string;
  };
  email: string;
  phone: string;
  registryKey: string;
  ovt: string;
  invoicingOperator: string | null;
  sapCustomerNumber: string | null;
};

export type JohtoselvitysFormData = {
  name: string;
  customerWithContacts: {
    customer: Customer;
    contacts: Contact[];
  };
  contractorWithContacts: {
    customer: Customer;
    contacts: Contact[];
  };
  geometry: HaitatonGeometry;
  startTime: number | null;
  endTime: number | null;
  pendingOnClient: boolean;
  identificationNumber: string; // hankeTunnus
  clientApplicationKind: string;
  workDescription: string;
  postalAddress: string;
  representativeWithContacts: null;
  invoicingCustomer: null;
  customerReference: null;
  area: null;
  propertyDeveloperWithContacts: null;
  constructionWork: boolean;
  maintenanceWork: boolean;
  emergencyWork: boolean;
  propertyConnectivity: boolean;
};

export interface JohtoselvitysFormValues {
  id: number | undefined;
  userId: string | null;
  applicationType: ApplicationType;
  applicationData: JohtoselvitysFormData;
}
