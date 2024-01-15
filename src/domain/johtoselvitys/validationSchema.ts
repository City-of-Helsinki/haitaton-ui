import yup from '../../common/utils/yup';
import isValidBusinessId from '../../common/utils/isValidBusinessId';
import { JohtoselvitysFormValues } from './types';
import { AlluStatus, ApplicationType, ContactType } from '../application/types/application';

const addressSchema = yup
  .object({
    streetAddress: yup.object({
      streetName: yup.string().trim().nullable().required(),
    }),
    postalCode: yup.string(),
    city: yup.string(),
  })
  .nullable();

const contactSchema = yup
  .object({
    firstName: yup.string().trim().required(),
    lastName: yup.string().trim().required(),
    email: yup.string().trim().email().max(100).required(),
    phone: yup.string().trim().max(20).required(),
    orderer: yup.boolean().required(),
  })
  .nullable()
  .required();

const customerSchema = contactSchema.omit(['firstName', 'lastName', 'orderer']).shape({
  name: yup.string().trim().required(),
  type: yup.mixed<ContactType>().nullable().required(),
  registryKey: yup // business id i.e. Y-tunnus
    .string()
    .defined()
    .nullable()
    .when('type', {
      is: (value: string) => value === 'COMPANY' || value === 'ASSOCIATION',
      then: (schema) =>
        schema.test('is-business-id', 'Is not valid business id', isValidBusinessId),
      otherwise: (schema) => schema,
    }),
  country: yup.string().defined(),
  ovt: yup.string().defined().nullable(),
  invoicingOperator: yup.string().defined().nullable(),
  sapCustomerNumber: yup.string().defined().nullable(),
});

const customerWithContactsSchema = yup.object({
  customer: customerSchema.required(),
  contacts: yup.array(contactSchema).defined(),
});

const areaSchema = yup.object({
  geometry: yup.object({
    type: yup.mixed<'Polygon'>().required(),
    crs: yup.object({
      type: yup.string().required(),
      properties: yup.object({ name: yup.string() }),
    }),
    coordinates: yup.array().required(),
  }),
});

const applicationTypeSchema = yup.mixed<ApplicationType>().defined().required();

export const validationSchema: yup.ObjectSchema<JohtoselvitysFormValues> = yup.object({
  id: yup.number().defined().nullable(),
  alluid: yup.number().nullable(),
  alluStatus: yup.mixed<AlluStatus>().defined().nullable(),
  applicationType: applicationTypeSchema,
  applicationIdentifier: yup.string().nullable(),
  hankeTunnus: yup.string().defined().nullable(),
  applicationData: yup.object({
    applicationType: applicationTypeSchema,
    name: yup.string().trim().required(),
    postalAddress: addressSchema,
    workDescription: yup.string().trim().required(),
    rockExcavation: yup.boolean().nullable().required(),
    constructionWork: yup
      .boolean()
      .defined()
      .when(['maintenanceWork', 'emergencyWork', 'propertyConnectivity'], {
        is: false,
        then: (schema) => schema.isTrue(),
      }),
    maintenanceWork: yup.boolean().defined(),
    emergencyWork: yup.boolean().defined(),
    propertyConnectivity: yup.boolean().defined(),
    contractorWithContacts: customerWithContactsSchema,
    customerWithContacts: customerWithContactsSchema,
    propertyDeveloperWithContacts: customerWithContactsSchema.nullable(),
    representativeWithContacts: customerWithContactsSchema.nullable(),
    startTime: yup.date().nullable().required(),
    endTime: yup
      .date()
      .when('startTime', (startTime: Date[], schema: yup.DateSchema) => {
        try {
          return startTime ? schema.min(startTime) : schema;
        } catch (error) {
          return schema;
        }
      })
      .nullable()
      .required(),
    areas: yup.array(areaSchema).min(1).required(),
  }),
  selfIntersectingPolygon: yup.boolean().isFalse(),
  geometriesChanged: yup.boolean(),
});
