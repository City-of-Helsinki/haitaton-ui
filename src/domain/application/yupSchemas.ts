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

// y-tunnus, henkilötunnus or general registry key
export const registryKeySchema = yup
  .string()
  .defined()
  .nullable()
  .when('type', {
    is: (value: string) => value === 'COMPANY' || value === 'ASSOCIATION',
    then: (schema) => schema.businessId(),
  })
  .when('type', {
    is: (value: string) => value === 'PERSON',
    then: (schema) =>
      schema.when('registryKeyHidden', {
        is: (value: boolean) => !value,
        then: (personalIdSchema) => personalIdSchema.personalId(),
      }),
  });

export const customerSchema = contactSchema.omit(['firstName', 'lastName']).shape({
  yhteystietoId: yup.string().nullable(),
  name: yup.string().trim().max(100).required(),
  type: yup.mixed<ContactType>().nullable().required(),
  registryKey: registryKeySchema,
  registryKeyHidden: yup.boolean().required(),
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
    registryKeyHidden: yup.boolean().required(),
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

export const sendSchema = yup.object().shape({
  applicationId: yup.number().defined().required(),
  orderPaperDecision: yup.boolean().required(),
  paperDecisionReceiver: yup.lazy((_value, context) => {
    // Checking the value of `orderPaperDecision` from the context
    if (context.parent.orderPaperDecision) {
      return yup
        .object({
          name: yup.string().trim().max(100).required(),
          streetAddress: yup.string().trim().max(100).required(),
          postalCode: yup.string().trim().max(10).required(),
          city: yup.string().trim().max(100).required(),
        })
        .required();
    }
    return yup.mixed().nullable();
  }),
});
