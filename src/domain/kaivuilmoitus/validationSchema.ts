import yup from '../../common/utils/yup';
import { AlluStatus } from '../application/types/application';
import {
  applicationTypeSchema,
  customerWithContactsSchema,
  geometrySchema,
  invoicingCustomerSchema,
} from '../application/yupSchemas';
import { KaivuilmoitusFormValues } from './types';
import {
  HANKE_KAISTAHAITTA_KEY,
  HANKE_KAISTAPITUUSHAITTA_KEY,
  HANKE_MELUHAITTA_KEY,
  HANKE_POLYHAITTA_KEY,
  HANKE_TARINAHAITTA_KEY,
  HANKE_TYOMAATYYPPI_KEY,
} from './../types/hanke';
import { HaittaIndexData } from '../common/haittaIndexes/types';

const tyoalueSchema = yup.object({
  geometry: geometrySchema.required(),
  area: yup.number().required(),
  tormaystarkasteluTulos: yup.mixed<HaittaIndexData>().nullable(),
});

const kaivuilmoitusAlueSchema = yup.object({
  name: yup.string().required(),
  hankealueId: yup.number().required(),
  tyoalueet: yup.array(tyoalueSchema).defined(),
  katuosoite: yup.string().required(),
  tyonTarkoitukset: yup.array(yup.mixed<HANKE_TYOMAATYYPPI_KEY>().defined()).min(1).required(),
  meluhaitta: yup.mixed<HANKE_MELUHAITTA_KEY>().required(),
  polyhaitta: yup.mixed<HANKE_POLYHAITTA_KEY>().required(),
  tarinahaitta: yup.mixed<HANKE_TARINAHAITTA_KEY>().required(),
  kaistahaitta: yup.mixed<HANKE_KAISTAHAITTA_KEY>().required(),
  kaistahaittojenPituus: yup.mixed<HANKE_KAISTAPITUUSHAITTA_KEY>().required(),
  lisatiedot: yup.string(),
});

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
  invoicingCustomer: invoicingCustomerSchema,
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
  areas: yup.array(kaivuilmoitusAlueSchema).min(1).required(),
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

export const alueetSchema = yup.object({
  applicationData: applicationDataSchema.pick(['areas']),
});

export const yhteystiedotSchema = yup.object({
  applicationData: applicationDataSchema.pick([
    'customerWithContacts',
    'contractorWithContacts',
    'propertyDeveloperWithContacts',
    'representativeWithContacts',
    'invoicingCustomer',
  ]),
});

export const liitteetSchema = yup.object({
  applicationData: applicationDataSchema.pick(['additionalInfo']),
});
