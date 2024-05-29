import yup from '../../common/utils/yup';
import { ApplicationType, ContactType } from './types/application';
import isValidBusinessId from '../../common/utils/isValidBusinessId';

const contactSchema = yup
  .object({
    firstName: yup.string().trim().max(50).required(),
    lastName: yup.string().trim().max(50).required(),
    email: yup.string().trim().email().max(100).required(),
    phone: yup.string().phone().trim().max(20).required(),
  })
  .nullable()
  .required();

// business id i.e. Y-tunnus
const registryKeySchema = yup
  .string()
  .defined()
  .nullable()
  .when('type', {
    is: (value: string) => value === 'COMPANY' || value === 'ASSOCIATION',
    then: (schema) => schema.test('is-business-id', 'Is not valid business id', isValidBusinessId),
    otherwise: (schema) => schema,
  });

const customerSchema = contactSchema.omit(['firstName', 'lastName']).shape({
  yhteystietoId: yup.string().nullable(),
  name: yup.string().trim().max(100).required(),
  type: yup.mixed<ContactType>().nullable().required(),
  registryKey: registryKeySchema,
});

export const customerWithContactsSchema = yup.object({
  customer: customerSchema,
  contacts: yup
    .array(contactSchema)
    .transform((value) => (value === null ? [] : value))
    .defined()
    .min(1, ({ min }) => ({ key: 'yhteyshenkilotMin', values: { min } })),
});

const postalAddressSchema = yup.object({
  streetAddress: yup.object({
    streetName: yup.string().nullable(),
  }),
  postalCode: yup.string().nullable(),
  city: yup.string().nullable(),
});

const requiredPostalAddressSchema = yup.object({
  streetAddress: yup.object({
    streetName: yup.string().required(),
  }),
  postalCode: yup.string().required(),
  city: yup.string().required(),
});

export const invoicingCustomerSchema = yup.object({
  name: yup.string().trim().max(100).required(),
  type: yup.mixed<ContactType>().required(),
  registryKey: registryKeySchema.required(),
  postalAddress: postalAddressSchema.when(['ovt', 'invoicingOperator', 'customerReference'], {
    is: (ovt: string, invoicingOperator: string, customerReference: string) =>
      !ovt || !invoicingOperator || !customerReference,
    then: () => requiredPostalAddressSchema,
    otherwise: (schema) => schema,
  }),
  email: yup.string().nullable().trim().email().max(100),
  phone: yup.string().nullable().phone().trim().max(20),
  ovt: yup.string().min(12).nullable(),
  invoicingOperator: yup.string().nullable(),
  customerReference: yup.string().nullable(),
});

export const geometrySchema = yup.object({
  type: yup.mixed<'Polygon'>().required(),
  crs: yup.object({
    type: yup.string().required(),
    properties: yup.object({ name: yup.string() }),
  }),
  coordinates: yup.array().required(),
});

export const areaSchema = yup.object({
  geometry: geometrySchema,
});

export const applicationTypeSchema = yup.mixed<ApplicationType>().defined().required();
