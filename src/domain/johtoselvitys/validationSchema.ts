import { $enum } from 'ts-enum-util';
import yup from '../../common/utils/yup';
import { ContactType } from '../application/types/application';
import isValidBusinessId from '../../common/utils/isValidBusinessId';

const requiredAddressSchema = yup.object().shape({
  streetAddress: yup.object().shape({
    streetName: yup.string().nullable().required(),
  }),
  postalCode: yup.string().nullable().required(),
  city: yup.string().nullable().required(),
});

const contactSchema = yup
  .object()
  .nullable()
  .default(null)
  .shape({
    name: yup.string().max(100).required(),
    email: yup.string().email().max(100).required(),
    phone: yup.string().max(20).required(),
  });

const customerSchema = contactSchema.shape({
  type: yup.string().oneOf($enum(ContactType).getValues()).nullable().required(),
  registryKey: yup // business id i.e. Y-tunnus
    .string()
    .nullable()
    .when('type', {
      is: 'COMPANY',
      then: (schema) =>
        schema.test('is-business-id', 'Is not valid business id', isValidBusinessId),
      otherwise: (schema) => schema,
    }),
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
    name: yup.string().required(),
    postalAddress: requiredAddressSchema,
    workDescription: yup.string().required(),
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
    endTime: yup.date().nullable().required(),
    areas: yup.array(areaSchema).min(1),
  }),
});
