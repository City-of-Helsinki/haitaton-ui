import yup from '../../common/utils/yup';
import isValidBusinessId from '../../common/utils/isValidBusinessId';
import { MAX_ATTACHMENT_NUMBER } from './constants';

const addressSchema = yup.object().shape({
  streetAddress: yup.object().shape({
    streetName: yup.string().trim().nullable().required(),
  }),
});

const contactSchema = yup
  .object()
  .nullable()
  .default(null)
  .shape({
    firstName: yup.string().trim().required(),
    lastName: yup.string().trim().required(),
    email: yup.string().trim().email().max(100).required(),
    phone: yup.string().trim().max(20).required(),
    orderer: yup.boolean(),
  });

const customerSchema = contactSchema.omit(['firstName', 'lastName']).shape({
  name: yup.string().trim().required(),
  type: yup.string().nullable().required(),
  registryKey: yup // business id i.e. Y-tunnus
    .string()
    .nullable()
    .when('type', {
      is: (value: string) => value === 'COMPANY' || value === 'ASSOCIATION',
      then: (schema) =>
        schema.test('is-business-id', 'Is not valid business id', isValidBusinessId),
      otherwise: (schema) => schema,
    }),
  country: yup.string().nullable(),
  ovt: yup.string().nullable(),
  invoicingOperator: yup.string().nullable(),
  sapCustomerNumber: yup.string().nullable(),
});

const customerWithContactsSchema = yup.object().shape({
  contacts: yup.array().ensure().of(contactSchema),
  customer: customerSchema.required(),
});

const areaSchema = yup.object().shape({
  name: yup.string(),
});

export const validationSchema = yup.object().shape({
  applicationData: yup.object().shape({
    name: yup.string().trim().required(),
    postalAddress: addressSchema,
    workDescription: yup.string().trim().required(),
    rockExcavation: yup.boolean().nullable().required(),
    constructionWork: yup
      .boolean()
      .when(['maintenanceWork', 'emergencyWork', 'propertyConnectivity'], {
        is: false,
        then: (schema) => schema.isTrue(),
      }),
    maintenanceWork: yup.boolean(),
    emergencyWork: yup.boolean(),
    propertyConnectivity: yup.boolean(),
    contractorWithContacts: customerWithContactsSchema.required(),
    customerWithContacts: customerWithContactsSchema.required(),
    propertyDeveloperWithContacts: customerWithContactsSchema.nullable(),
    representativeWithContacts: customerWithContactsSchema.nullable(),
    startTime: yup.date().nullable().required(),
    endTime: yup
      .date()
      .when('startTime', (startTime: Date, schema: yup.DateSchema) => {
        try {
          return startTime ? schema.min(startTime) : schema;
        } catch (error) {
          return schema;
        }
      })
      .nullable()
      .required(),
    areas: yup.array(areaSchema).min(1),
  }),
  selfIntersectingPolygon: yup.boolean().isFalse(),
  attachmentNumber: yup.number().max(MAX_ATTACHMENT_NUMBER),
});
