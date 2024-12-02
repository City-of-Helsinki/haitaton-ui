export enum TaydennyspyyntoFieldKey {
  CUSTOMER = 'CUSTOMER',
  INVOICING_CUSTOMER = 'INVOICING_CUSTOMER',
  PROPERTY_DEVELOPER = 'PROPERTY_DEVELOPER',
  CONTRACTOR = 'CONTRACTOR',
  REPRESENTATIVE = 'REPRESENTATIVE',
  GEOMETRY = 'GEOMETRY',
  START_TIME = 'START_TIME',
  END_TIME = 'END_TIME',
  IDENTIFICATION_NUMBER = 'IDENTIFICATION_NUMBER',
  CLIENT_APPLICATION_KIND = 'CLIENT_APPLICATION_KIND',
  APPLICATION_KIND = 'APPLICATION_KIND',
  POSTAL_ADDRESS = 'POSTAL_ADDRESS',
  WORK_DESCRIPTION = 'WORK_DESCRIPTION',
  PROPERTY_IDENTIFICATION_NUMBER = 'PROPERTY_IDENTIFICATION_NUMBER',
  ATTACHMENT = 'ATTACHMENT',
  AREA = 'AREA',
  OTHER = 'OTHER',
}

export type TaydennyspyyntoField = {
  key: TaydennyspyyntoFieldKey;
  message: string;
};

export type Taydennyspyynto = {
  id: string;
  kentat: TaydennyspyyntoField[];
};

export type Taydennys<T> = {
  id: string;
  applicationData: T;
  muutokset: string[];
};
