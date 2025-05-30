import yup from '../../common/utils/yup';
import { AlluStatus, ContactType, KaivuilmoitusData } from '../application/types/application';
import {
  applicationTypeSchema,
  customerSchema,
  customerWithContactsSchema,
  geometrySchema,
  invoicingCustomerSchema,
  registryKeySchema,
} from '../application/yupSchemas';
import { KaivuilmoitusFormValues } from './types';
import {
  HANKE_KAISTAHAITTA_KEY,
  HANKE_KAISTAPITUUSHAITTA_KEY,
  HANKE_MELUHAITTA_KEY,
  HANKE_POLYHAITTA_KEY,
  HANKE_TARINAHAITTA_KEY,
  HANKE_TYOMAATYYPPI_KEY,
} from '../types/hanke';
import { HaittaIndexData } from '../common/haittaIndexes/types';
import { Taydennys, Taydennyspyynto } from '../application/taydennys/types';
import haittojenhallintaSchema from '../common/haittojenhallinta/haittojenhallintaSchema';
import { FORM_PAGES } from '../forms/types';
import { Muutosilmoitus } from '../application/muutosilmoitus/types';

const tyoalueSchema = yup.object({
  geometry: geometrySchema.required(),
  area: yup.number().required(),
  tormaystarkasteluTulos: yup.mixed<HaittaIndexData>().nullable(),
});

const kaivuilmoitusAlueSchema = yup.object({
  name: yup.string().required(),
  hankealueId: yup.number().required(),
  tyoalueet: yup.array(tyoalueSchema).defined(),
  katuosoite: yup.string().required().meta({ pageName: FORM_PAGES.ALUEET }),
  tyonTarkoitukset: yup
    .array(yup.mixed<HANKE_TYOMAATYYPPI_KEY>().defined())
    .min(1)
    .required()
    .meta({ pageName: FORM_PAGES.ALUEET }),
  meluhaitta: yup.mixed<HANKE_MELUHAITTA_KEY>().required().meta({ pageName: FORM_PAGES.ALUEET }),
  polyhaitta: yup.mixed<HANKE_POLYHAITTA_KEY>().required().meta({ pageName: FORM_PAGES.ALUEET }),
  tarinahaitta: yup
    .mixed<HANKE_TARINAHAITTA_KEY>()
    .required()
    .meta({ pageName: FORM_PAGES.ALUEET }),
  kaistahaitta: yup
    .mixed<HANKE_KAISTAHAITTA_KEY>()
    .required()
    .meta({ pageName: FORM_PAGES.ALUEET }),
  kaistahaittojenPituus: yup
    .mixed<HANKE_KAISTAPITUUSHAITTA_KEY>()
    .required()
    .meta({ pageName: FORM_PAGES.ALUEET }),
  lisatiedot: yup.string(),
  haittojenhallintasuunnitelma: haittojenhallintaSchema,
});

const customerWithContactsSchemaForKaivuilmoitusForTyostaVastaava = customerWithContactsSchema
  .omit(['customer'])
  .shape({
    customer: customerSchema.omit(['registryKey']).shape({
      registryKey: registryKeySchema.required(),
    }),
  });

const customerWithContactsSchemaForKaivuilmoitus = customerWithContactsSchema
  .omit(['customer'])
  .shape({
    customer: customerSchema.omit(['registryKey']).shape({
      registryKey: registryKeySchema.when('type', {
        is: (value: string) => value === ContactType.COMPANY || value === ContactType.ASSOCIATION,
        then: (schema) => schema.required(),
      }),
    }),
  });

export const applicationDataSchema = yup.object().shape(
  {
    applicationType: applicationTypeSchema,
    name: yup.string().trim().required().meta({ pageName: FORM_PAGES.PERUSTIEDOT }),
    workDescription: yup.string().trim().required().meta({ pageName: FORM_PAGES.PERUSTIEDOT }),
    rockExcavation: yup
      .boolean()
      .defined()
      .nullable()
      .when(['cableReportDone'], { is: false, then: (schema) => schema.required() }),
    constructionWork: yup
      .boolean()
      .defined()
      .when(['maintenanceWork', 'emergencyWork'], {
        is: false,
        then: (schema) => schema.isTrue(),
      })
      .meta({ pageName: FORM_PAGES.PERUSTIEDOT }),
    maintenanceWork: yup.boolean().defined(),
    emergencyWork: yup.boolean().defined(),
    cableReportDone: yup.boolean().required().meta({ pageName: FORM_PAGES.PERUSTIEDOT }),
    cableReports: yup
      .array()
      .of(yup.string().required())
      .when(['cableReportDone'], {
        is: true,
        then: (schema) => schema.min(1),
      })
      .meta({ pageName: FORM_PAGES.PERUSTIEDOT }),
    requiredCompetence: yup
      .boolean()
      .required()
      .isTrue()
      .meta({ pageName: FORM_PAGES.PERUSTIEDOT }),
    contractorWithContacts: customerWithContactsSchemaForKaivuilmoitus,
    customerWithContacts: customerWithContactsSchemaForKaivuilmoitusForTyostaVastaava,
    propertyDeveloperWithContacts: customerWithContactsSchemaForKaivuilmoitus.nullable(),
    representativeWithContacts: customerWithContactsSchemaForKaivuilmoitus.nullable(),
    invoicingCustomer: invoicingCustomerSchema,
    startTime: yup
      .date()
      .when('endTime', (endTime: Date[], schema: yup.DateSchema) => {
        try {
          return endTime ? schema.max(endTime[0]) : schema;
        } catch (error) {
          return schema;
        }
      })
      .nullable()
      .required()
      .meta({ pageName: FORM_PAGES.ALUEET }),
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
    areas: yup
      .array(kaivuilmoitusAlueSchema)
      .min(1)
      .required()
      .meta({ pageName: FORM_PAGES.ALUEET }),
    additionalInfo: yup.string().max(2000).nullable(),
  },
  [['startTime', 'endTime']],
);

export const validationSchema: yup.ObjectSchema<KaivuilmoitusFormValues> = yup.object({
  id: yup.number().defined().nullable(),
  alluid: yup.number().nullable(),
  alluStatus: yup.mixed<AlluStatus>().defined().nullable(),
  applicationType: applicationTypeSchema,
  applicationIdentifier: yup.string().nullable(),
  hankeTunnus: yup.string().defined().nullable(),
  applicationData: applicationDataSchema,
  valmistumisilmoitukset: yup.object().nullable().notRequired(),
  taydennyspyynto: yup.mixed<Taydennyspyynto>().nullable(),
  taydennys: yup.mixed<Taydennys<KaivuilmoitusData>>().nullable(),
  selfIntersectingPolygon: yup.boolean().isFalse(),
  geometriesChanged: yup.boolean(),
  muutosilmoitus: yup.mixed<Muutosilmoitus<KaivuilmoitusData>>().nullable(),
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
    'cableReports',
    'cableReportDone',
  ]),
});

export const alueetSchema = yup.object({
  applicationData: applicationDataSchema.pick(['areas', 'startTime', 'endTime']).shape({
    areas: yup
      .array(kaivuilmoitusAlueSchema.omit(['haittojenhallintasuunnitelma']))
      .min(1)
      .required(),
  }),
});

export const haittojenhallintaSuunnitelmaSchema = yup.object({
  applicationData: applicationDataSchema.pick(['areas']).shape({
    areas: yup.array(kaivuilmoitusAlueSchema.pick(['haittojenhallintasuunnitelma'])).min(1),
  }),
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

export const reportCompletionDateSchema = yup.object({
  applicationId: yup.number(),
  date: yup.date().validCompletionDate().nullable().required(),
});
