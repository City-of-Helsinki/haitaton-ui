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

export const invoicingCustomerSchema = yup.object({
  name: yup.string().trim().max(100).required(),
  type: yup.mixed<ContactType>().nullable().required(),
  registryKey: registryKeySchema.required(),
  postalAddress: yup
    .object({
      streetAddress: yup.object({
        streetName: yup.string().when(['ovt', 'invoicingOperator'], {
          is: (ovt: string, invoicingOperator: string) => {
            return !ovt && !invoicingOperator;
          },
          then: (schema) => schema.required(),
          otherwise: (schema) => schema,
        }),
      }),
      postalCode: yup.string().required(),
      city: yup.string(),
    })
    .required(),
  email: yup.string().trim().email().max(100),
  phone: yup.string().phone().trim().max(20),
  ovt: yup.string(),
  invoicingOperator: yup.string(),
  customerReference: yup.string(),
});

export const areaSchema = yup.object({
  geometry: yup.object({
    type: yup.mixed<'Polygon'>().required(),
    crs: yup.object({
      type: yup.string().required(),
      properties: yup.object({ name: yup.string() }),
    }),
    coordinates: yup.array().required(),
  }),
});

export const applicationTypeSchema = yup.mixed<ApplicationType>().defined().required();
