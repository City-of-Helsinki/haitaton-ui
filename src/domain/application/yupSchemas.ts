import yup from '../../common/utils/yup';
import { ApplicationType, ContactType } from './types/application';
import isValidBusinessId from '../../common/utils/isValidBusinessId';

const contactSchema = yup
  .object({
    firstName: yup.string().trim().required(),
    lastName: yup.string().trim().required(),
    email: yup.string().trim().email().max(100).required(),
    phone: yup.string().trim().max(20).required(),
  })
  .nullable()
  .required();

const customerSchema = contactSchema.omit(['firstName', 'lastName']).shape({
  yhteystietoId: yup.string().nullable(),
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
});

export const customerWithContactsSchema = yup.object({
  customer: customerSchema,
  contacts: yup
    .array(contactSchema)
    .transform((value) => (value === null ? [] : value))
    .defined()
    .min(1, ({ min }) => ({ key: 'yhteyshenkilotMin', values: { min } })),
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
