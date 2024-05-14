import yup from '../../common/utils/yup';
import { AlluStatus } from '../application/types/application';
import {
  applicationTypeSchema,
  areaSchema,
  customerWithContactsSchema,
} from '../application/yupSchemas';
import { KaivuilmoitusFormValues } from './types';

const applicationDataSchema = yup.object({
  applicationType: applicationTypeSchema,
  name: yup.string().trim().required(),
  workDescription: yup.string().trim().required(),
  rockExcavation: yup.boolean().nullable().required(),
  constructionWork: yup
    .boolean()
    .defined()
    .when(['maintenanceWork', 'emergencyWork'], {
      is: false,
      then: (schema) => schema.isTrue(),
    }),
  maintenanceWork: yup.boolean().defined(),
  emergencyWork: yup.boolean().defined(),
  cableReportDone: yup.boolean().required(),
  requiredCompetence: yup.boolean().required(),
  contractorWithContacts: customerWithContactsSchema,
  customerWithContacts: customerWithContactsSchema,
  propertyDeveloperWithContacts: customerWithContactsSchema.nullable(),
  representativeWithContacts: customerWithContactsSchema.nullable(),
  startTime: yup.date().nullable().required(),
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
    .required(),
  areas: yup.array(areaSchema).min(1).required(),
  additionalInfo: yup.string().max(2000).nullable(),
});

export const validationSchema: yup.ObjectSchema<KaivuilmoitusFormValues> = yup.object({
  id: yup.number().defined().nullable(),
  alluid: yup.number().nullable(),
  alluStatus: yup.mixed<AlluStatus>().defined().nullable(),
  applicationType: applicationTypeSchema,
  applicationIdentifier: yup.string().nullable(),
  hankeTunnus: yup.string().defined().nullable(),
  applicationData: applicationDataSchema,
  selfIntersectingPolygon: yup.boolean().isFalse(),
  geometriesChanged: yup.boolean(),
});

export const perustiedotSchema = yup.object({
  applicationData: applicationDataSchema.pick([
    'name',
    'workDescription',
    'rockExcavation',
    'constructionWork',
    'maintenanceWork',
    'emergencyWork',
    'requiredCompetence',
  ]),
});

export const liitteetSchema = yup.object({
  applicationData: applicationDataSchema.pick(['additionalInfo']),
});
