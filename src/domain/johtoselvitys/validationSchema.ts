import yup from '../../common/utils/yup';
import { JohtoselvitysFormValues } from './types';
import { AlluStatus, JohtoselvitysData } from '../application/types/application';
import {
  applicationTypeSchema,
  areaSchema,
  customerWithContactsSchema,
} from '../application/yupSchemas';
import { Taydennys, Taydennyspyynto } from '../application/taydennys/types';
import { FORM_PAGES } from '../forms/types';
import { Muutosilmoitus } from '../application/muutosilmoitus/types';

const addressSchema = yup
  .object({
    streetAddress: yup.object({
      streetName: yup
        .string()
        .trim()
        .nullable()
        .required()
        .meta({ pageName: FORM_PAGES.PERUSTIEDOT }),
    }),
    postalCode: yup.string(),
    city: yup.string(),
  })
  .nullable();

export const johtoselvitysApplicationDataSchema = yup.object({
  applicationType: applicationTypeSchema,
  name: yup.string().trim().required().meta({ pageName: FORM_PAGES.PERUSTIEDOT }),
  postalAddress: addressSchema,
  workDescription: yup.string().trim().required().meta({ pageName: FORM_PAGES.PERUSTIEDOT }),
  rockExcavation: yup.boolean().nullable().required().meta({ pageName: FORM_PAGES.PERUSTIEDOT }),
  constructionWork: yup
    .boolean()
    .defined()
    .when(['maintenanceWork', 'emergencyWork', 'propertyConnectivity'], {
      is: false,
      then: (schema) => schema.isTrue(),
    })
    .meta({ pageName: FORM_PAGES.PERUSTIEDOT }),
  maintenanceWork: yup.boolean().defined(),
  emergencyWork: yup.boolean().defined(),
  propertyConnectivity: yup.boolean().defined(),
  contractorWithContacts: customerWithContactsSchema,
  customerWithContacts: customerWithContactsSchema,
  propertyDeveloperWithContacts: customerWithContactsSchema.nullable(),
  representativeWithContacts: customerWithContactsSchema.nullable(),
  startTime: yup.date().nullable().required().meta({ pageName: FORM_PAGES.ALUEET }),
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
    .required()
    .meta({ pageName: FORM_PAGES.ALUEET }),
  areas: yup.array(areaSchema).min(1).required().meta({ pageName: FORM_PAGES.ALUEET }),
});

export const validationSchema: yup.ObjectSchema<JohtoselvitysFormValues> = yup.object({
  id: yup.number().defined().nullable(),
  alluid: yup.number().nullable(),
  alluStatus: yup.mixed<AlluStatus>().defined().nullable(),
  applicationType: applicationTypeSchema,
  applicationIdentifier: yup.string().nullable(),
  hankeTunnus: yup.string().defined().nullable(),
  applicationData: johtoselvitysApplicationDataSchema,
  valmistumisilmoitukset: yup.object().nullable().notRequired(),
  taydennyspyynto: yup.mixed<Taydennyspyynto>().nullable(),
  taydennys: yup.mixed<Taydennys<JohtoselvitysData>>().nullable(),
  selfIntersectingPolygon: yup.boolean().isFalse(),
  geometriesChanged: yup.boolean(),
  muutosilmoitus: yup.mixed<Muutosilmoitus<JohtoselvitysData>>().nullable(),
});

export const newJohtoselvitysSchema = yup.object({
  nimi: yup.string().trim().required(),
  perustaja: yup.object({
    sahkoposti: yup.string().email().required(),
    puhelinnumero: yup.string().phone().max(20).required(),
  }),
});

export const perustiedotSchema = yup.object({
  applicationData: johtoselvitysApplicationDataSchema.pick([
    'name',
    'postalAddress',
    'workDescription',
    'rockExcavation',
    'constructionWork',
    'maintenanceWork',
    'emergencyWork',
    'propertyConnectivity',
  ]),
});

export const alueetSchema = yup.object({
  applicationData: johtoselvitysApplicationDataSchema.pick(['startTime', 'endTime', 'areas']),
});

export const yhteystiedotSchema = yup.object({
  applicationData: johtoselvitysApplicationDataSchema.pick([
    'customerWithContacts',
    'contractorWithContacts',
    'propertyDeveloperWithContacts',
    'representativeWithContacts',
  ]),
});
