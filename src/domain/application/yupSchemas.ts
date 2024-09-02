import yup from '../../common/utils/yup';
import { ApplicationType, ContactType, PostalAddress } from './types/application';

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
export const registryKeySchema = yup
  .string()
  .defined()
  .nullable()
  .when('type', {
    is: (value: string) => value === 'COMPANY' || value === 'ASSOCIATION',
    then: (schema) => schema.businessId(),
  });

export const customerSchema = contactSchema.omit(['firstName', 'lastName']).shape({
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

function ovtRequired(postalAddress: PostalAddress, type: ContactType) {
  return (
    (type === 'COMPANY' || type === 'ASSOCIATION') &&
    (!postalAddress?.streetAddress.streetName || !postalAddress?.postalCode || !postalAddress?.city)
  );
}

export const invoicingCustomerSchema = yup.object().shape(
  {
    name: yup.string().trim().max(100).required(),
    type: yup.mixed<ContactType>().required(),
    registryKey: registryKeySchema.required(),
    postalAddress: postalAddressSchema.when(['ovt', 'invoicingOperator'], {
      is: (ovt: string, invoicingOperator: string) => !ovt || !invoicingOperator,
      then: () => requiredPostalAddressSchema,
      otherwise: (schema) => schema,
    }),
    email: yup.string().nullable().trim().email().max(100),
    phone: yup.string().nullable().phone().trim().max(20),
    ovt: yup
      .string()
      .nullable()
      .transform((value: string, originalValue: string) => (originalValue === '' ? null : value))
      .min(12)
      .when(['postalAddress', 'type'], {
        is: ovtRequired,
        then: (schema) => schema.required(),
      }),
    invoicingOperator: yup
      .string()
      .nullable()
      .when(['postalAddress', 'type'], {
        is: ovtRequired,
        then: (schema) => schema.required(),
      }),
    customerReference: yup.string().nullable(),
  },
  [
    ['ovt', 'postalAddress'],
    ['invoicingOperator', 'postalAddress'],
  ],
);

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
