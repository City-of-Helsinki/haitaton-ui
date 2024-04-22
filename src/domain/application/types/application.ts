import { AttachmentMetadata } from '../../../common/types/attachment';
import { Polygon, Position } from 'geojson';
import { Coordinate } from 'ol/coordinate';
import { CRS } from '../../../common/types/hanke';
import yup from '../../../common/utils/yup';
import { newJohtoselvitysSchema } from '../../johtoselvitys_new/validationSchema';

export type ApplicationType = 'CABLE_REPORT' | 'EXCAVATION_NOTIFICATION';

export type PostalAddress = {
  streetAddress: {
    streetName: string;
  };
  postalCode?: string;
  city?: string;
};

export type Contact = {
  hankekayttajaId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  orderer?: boolean;
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
  yhteystietoId?: string | null;
  type: keyof typeof ContactType | null;
  name: string;
  country?: string;
  email: string;
  phone: string;
  registryKey: string | null;
  ovt?: string | null;
  invoicingOperator?: string | null;
  sapCustomerNumber?: string | null;
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
  type = 'Polygon' as const;

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
  name?: string;
  geometry: ApplicationGeometry;
};

export type AttachmentType = 'MUU' | 'LIIKENNEJARJESTELY' | 'VALTAKIRJA';

export interface ApplicationAttachmentMetadata extends AttachmentMetadata {
  applicationId: number;
  attachmentType: AttachmentType;
}

export interface JohtoselvitysData {
  applicationType: ApplicationType;
  name: string;
  customerWithContacts: CustomerWithContacts | null;
  contractorWithContacts: CustomerWithContacts | null;
  areas: ApplicationArea[];
  startTime: Date | null;
  endTime: Date | null;
  workDescription: string;
  postalAddress: PostalAddress | null;
  representativeWithContacts: CustomerWithContacts | null;
  propertyDeveloperWithContacts: CustomerWithContacts | null;
  constructionWork: boolean;
  maintenanceWork: boolean;
  emergencyWork: boolean;
  propertyConnectivity: boolean;
  rockExcavation: boolean | null;
}

export interface KaivuilmoitusData {
  applicationType: ApplicationType;
  name: string;
  workDescription: string;
  constructionWork: boolean;
  maintenanceWork: boolean;
  emergencyWork: boolean;
  rockExcavation: boolean | null;
  cableReportDone: boolean;
  cableReports?: string[];
  placementContracts?: string[];
  requiredCompetence: boolean;
  areas: ApplicationArea[];
  startTime: Date | null;
  endTime: Date | null;
  customerWithContacts: CustomerWithContacts | null;
  contractorWithContacts: CustomerWithContacts | null;
  representativeWithContacts: CustomerWithContacts | null;
  propertyDeveloperWithContacts: CustomerWithContacts | null;
  additionalInfo?: string;
}

export type NewJohtoselvitysData = yup.InferType<typeof newJohtoselvitysSchema>;

export interface Application<T = JohtoselvitysData | KaivuilmoitusData> {
  id: number | null;
  alluid?: number | null;
  alluStatus: AlluStatusStrings | null;
  applicationType: ApplicationType;
  applicationData: T;
  applicationIdentifier?: string | null;
  hankeTunnus: string | null;
}

export interface HankkeenHakemus {
  id: number | null;
  alluid?: number | null;
  alluStatus: AlluStatusStrings | null;
  applicationIdentifier?: string | null;
  applicationType: ApplicationType;
  applicationData: {
    name: string;
    startTime: Date | null;
    endTime: Date | null;
    pendingOnClient: boolean;
  };
}

export interface ApplicationDeletionResult {
  hankeDeleted: boolean;
}

export function isCustomerWithContacts(value: unknown): value is CustomerWithContacts {
  return (value as CustomerWithContacts)?.contacts !== undefined;
}

export interface ApplicationUpdateContact {
  hankekayttajaId?: string;
}

function mapYhteyshenkiloToHankekayttajaId(contactPerson: Contact): ApplicationUpdateContact {
  return { hankekayttajaId: contactPerson.hankekayttajaId };
}
export class ApplicationUpdateCustomerWithContacts {
  customer: Customer;
  contacts: ApplicationUpdateContact[];

  static Create(customerWithContacts: CustomerWithContacts | null) {
    if (customerWithContacts === null || customerWithContacts.customer.type === null) {
      return null;
    }
    return new ApplicationUpdateCustomerWithContacts(customerWithContacts);
  }

  constructor({ customer, contacts }: CustomerWithContacts) {
    this.customer = customer;
    this.contacts = contacts?.map(mapYhteyshenkiloToHankekayttajaId) || [];
  }
}

export interface JohtoselvitysCreateData
  extends Pick<
    JohtoselvitysData,
    | 'applicationType'
    | 'name'
    | 'postalAddress'
    | 'workDescription'
    | 'constructionWork'
    | 'maintenanceWork'
    | 'emergencyWork'
    | 'propertyConnectivity'
    | 'rockExcavation'
  > {
  hankeTunnus: string;
}

export interface JohtoselvitysUpdateData
  extends Omit<
    JohtoselvitysData,
    | 'customerWithContacts'
    | 'contractorWithContacts'
    | 'representativeWithContacts'
    | 'propertyDeveloperWithContacts'
  > {
  customerWithContacts: ApplicationUpdateCustomerWithContacts | null;
  contractorWithContacts: ApplicationUpdateCustomerWithContacts | null;
  representativeWithContacts: ApplicationUpdateCustomerWithContacts | null;
  propertyDeveloperWithContacts: ApplicationUpdateCustomerWithContacts | null;
}

export interface KaivuilmoitusCreateData
  extends Pick<
    KaivuilmoitusData,
    | 'applicationType'
    | 'name'
    | 'workDescription'
    | 'constructionWork'
    | 'maintenanceWork'
    | 'emergencyWork'
    | 'rockExcavation'
    | 'cableReportDone'
    | 'requiredCompetence'
    | 'cableReports'
    | 'placementContracts'
  > {
  hankeTunnus: string;
}

export interface KaivuilmoitusUpdateData
  extends Omit<
    KaivuilmoitusData,
    | 'customerWithContacts'
    | 'contractorWithContacts'
    | 'representativeWithContacts'
    | 'propertyDeveloperWithContacts'
  > {
  customerWithContacts: ApplicationUpdateCustomerWithContacts | null;
  contractorWithContacts: ApplicationUpdateCustomerWithContacts | null;
  representativeWithContacts: ApplicationUpdateCustomerWithContacts | null;
  propertyDeveloperWithContacts: ApplicationUpdateCustomerWithContacts | null;
}
