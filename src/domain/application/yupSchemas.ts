import yup from '../../common/utils/yup';
import { FORM_PAGES } from '../forms/types';
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
  })
  .meta({ pageName: FORM_PAGES.YHTEYSTIEDOT });

export const customerSchema = yup.object({
  yhteystietoId: yup.string().nullable(),
  type: yup.mixed<ContactType>().nullable().required(),
  name: yup.string().trim().max(100).required().meta({ pageName: FORM_PAGES.YHTEYSTIEDOT }),
  registryKey: registryKeySchema,
  registryKeyHidden: yup.boolean().required().default(false),
  email: yup
    .string()
    .trim()
    .email()
    .max(100)
    .required()
    .meta({ pageName: FORM_PAGES.YHTEYSTIEDOT }),
  phone: yup.string().phone().trim().max(20).required().meta({ pageName: FORM_PAGES.YHTEYSTIEDOT }),
});

export const customerWithContactsSchema = yup.object({
  customer: customerSchema,
  contacts: yup
    .array(contactSchema)
    .transform((value) => (value === null ? [] : value))
    .defined()
    .min(1, ({ min }) => ({ key: 'yhteyshenkilotMin', values: { min } }))
    .meta({ pageName: FORM_PAGES.YHTEYSTIEDOT }),
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
    streetName: yup.string().required().meta({ pageName: FORM_PAGES.YHTEYSTIEDOT }),
  }),
  postalCode: yup.string().required().meta({ pageName: FORM_PAGES.YHTEYSTIEDOT }),
  city: yup.string().required().meta({ pageName: FORM_PAGES.YHTEYSTIEDOT }),
});

function ovtRequired(postalAddress: PostalAddress, type: ContactType) {
  return (
    (type === 'COMPANY' || type === 'ASSOCIATION') &&
    (!postalAddress?.streetAddress.streetName || !postalAddress?.postalCode || !postalAddress?.city)
  );
}

export const invoicingCustomerSchema = yup.object().shape(
  {
    name: yup.string().trim().max(100).required().meta({ pageName: FORM_PAGES.YHTEYSTIEDOT }),
    type: yup.mixed<ContactType>().required(),
    registryKey: registryKeySchema.required().meta({ pageName: FORM_PAGES.YHTEYSTIEDOT }),
    registryKeyHidden: yup.boolean().required(),
    postalAddress: postalAddressSchema.when(['ovt', 'invoicingOperator'], {
      is: (ovt: string, invoicingOperator: string) => !ovt || !invoicingOperator,
      then: () => requiredPostalAddressSchema,
      otherwise: (schema) => schema,
    }),
    email: yup
      .string()
      .nullable()
      .trim()
      .email()
      .max(100)
      .meta({ pageName: FORM_PAGES.YHTEYSTIEDOT }),
    phone: yup
      .string()
      .nullable()
      .phone()
      .trim()
      .max(20)
      .meta({ pageName: FORM_PAGES.YHTEYSTIEDOT }),
    ovt: yup
      .string()
      .nullable()
      .transform((value: string, originalValue: string) => (originalValue === '' ? null : value))
      .min(12)
      .when(['postalAddress', 'type'], {
        is: ovtRequired,
        then: (schema) => schema.required(),
      })
      .meta({ pageName: FORM_PAGES.YHTEYSTIEDOT }),
    invoicingOperator: yup
      .string()
      .nullable()
      .when(['postalAddress', 'type'], {
        is: ovtRequired,
        then: (schema) => schema.required(),
      })
      .meta({ pageName: FORM_PAGES.YHTEYSTIEDOT }),
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
  orderPaperDecision: yup.boolean().required(),
  paperDecisionReceiver: yup
    .object({
      name: yup.string().trim().max(100).required(),
      streetAddress: yup.string().trim().max(100).required(),
      postalCode: yup.string().trim().max(10).required(),
      city: yup.string().trim().max(100).required(),
    })
    .nullable()
    .test('paperDecisionConditional', 'Paper decision fields are invalid', function (value) {
      const { orderPaperDecision } = this.parent;
      // If toggle is off, ignore the inner fields
      if (!orderPaperDecision) return true;
      // Otherwise, validate the object (returning true if it exists)
      return !!value;
    }),
});
