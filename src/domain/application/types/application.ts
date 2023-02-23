import { Polygon, Position } from 'geojson';
import { Coordinate } from 'ol/coordinate';
import { CRS } from '../../../common/types/hanke';

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

export enum AlluStatus {
  PRE_RESERVED = 'PRE_RESERVED',
  NOTE = 'NOTE',
  PENDING_CLIENT = 'PENDING_CLIENT',
  PENDING = 'PENDING',
  WAITING_INFORMATION = 'WAITING_INFORMATION',
  INFORMATION_RECEIVED = 'INFORMATION_RECEIVED',
  HANDLING = 'HANDLING',
  RETURNED_TO_PREPARATION = 'RETURNED_TO_PREPARATION',
  WAITING_CONTRACT_APPROVAL = 'WAITING_CONTRACT_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  DECISIONMAKING = 'DECISIONMAKING',
  DECISION = 'DECISION',
  OPERATIONAL_CONDITION = 'OPERATIONAL_CONDITION',
  TERMINATED = 'TERMINATED',
  FINISHED = 'FINISHED',
  CANCELLED = 'CANCELLED',
  ARCHIVED = 'ARCHIVED',
  REPLACED = 'REPLACED',
}

export type AlluStatusStrings = keyof typeof AlluStatus;

type PolygonWithCRS = Polygon & { crs: CRS };

export class ApplicationGeometry implements PolygonWithCRS {
  type: 'Polygon' = 'Polygon';

  crs: CRS = {
    type: 'name',
    properties: {
      name: 'urn:ogc:def:crs:EPSG::3879',
    },
  };

  coordinates: Position[][] = [];

  constructor(coordinates: Coordinate[][]) {
    this.coordinates = coordinates;
  }
}

export type ApplicationArea = {
  name: string;
  geometry: ApplicationGeometry;
};

export type JohtoselvitysData = {
  hankeTunnus: string;
  applicationType: ApplicationType;
  name: string;
  customerWithContacts: CustomerWithContacts;
  contractorWithContacts: CustomerWithContacts;
  areas: ApplicationArea[];
  startTime: string | null;
  endTime: string | null;
  identificationNumber: string; // asiointitunnus
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
  rockExcavation: boolean | null;
};

export interface Application {
  id: number | null;
  alluid?: number | null;
  alluStatus: AlluStatusStrings | null;
  applicationType: ApplicationType;
  applicationData: JohtoselvitysData;
}

export function isCustomerWithContacts(value: unknown): value is CustomerWithContacts {
  return (value as CustomerWithContacts)?.contacts !== undefined;
}
