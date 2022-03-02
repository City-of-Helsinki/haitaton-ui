import { HaitatonGeometry } from '../../common/types/hanke';
type ApplicationType = 'CABLE_APPLICATION';

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

export type Customer = {
  type: string;
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
  ovt: string | null;
  invoicingOperator: string | null;
  sapCustomerNumber: string | null;
};

export type JohtoselvitysFormData = {
  name: string;
  customerWithContacts: {
    customer: Customer;
  };
  contacts: Contact[];
  geometry: HaitatonGeometry;
  startTime: number | null;
  endTime: number | null;
  pendingOnClient: boolean;
  identificationNumber: string; // hankeTunnus
  clientApplicationKind: string;
  workDescription: string;
  contractorWithContacts: {
    customer: Customer;
    contacts: Contact[];
  };
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
