import { $enum } from 'ts-enum-util';
import yup from '../../common/utils/yup';
import { ContactType } from '../application/types/application';

const requiredAddressSchema = yup.object().shape({
  streetAddress: yup.object().shape({
    streetName: yup.string().nullable().required(),
  }),
  postalCode: yup.string().nullable().required(),
  city: yup.string().nullable().required(),
});

const addressSchema = yup.object().shape({
  streetAddress: yup.object().shape({
    streetName: yup.string(),
  }),
  postalCode: yup.string(),
  city: yup.string(),
});

const contactSchema = yup
  .object()
  .nullable()
  .default(null)
  .shape({
    name: yup.string().max(100).required(),
    postalAddress: addressSchema,
    email: yup.string().email().max(100).required(),
    phone: yup.string().max(20).required(),
  });

const customerSchema = contactSchema.shape({
  type: yup.string().oneOf($enum(ContactType).getValues()).nullable().required(),
  registryKey: yup.string().required(), // social security number or business id i.e. Y-tunnus
});

const customerWithContactsSchema = yup.object().shape({
  contacts: yup.array().ensure().of(contactSchema),
  customer: customerSchema.required(),
});

export const validationSchema = yup.object().shape({
  applicationData: yup.object().shape({
    name: yup.string().required(),
    postalAddress: requiredAddressSchema,
    workDescription: yup.string().required(),
    rockExcavation: yup.boolean().nullable().required(),
    contractorWithContacts: customerWithContactsSchema.required(),
    customerWithContacts: customerWithContactsSchema.required(),
    propertyDeveloperWithContacts: customerWithContactsSchema.nullable(),
    representativeWithContacts: customerWithContactsSchema.nullable(),
    startTime: yup.date().nullable().required(),
    endTime: yup.date().nullable().required(),
  }),
});
