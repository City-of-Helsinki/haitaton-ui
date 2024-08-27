import yup from '../../../common/utils/yup';
import {
  CONTACT_TYYPPI,
  HAITTOJENHALLINTATYYPPI,
  HANKE_KAISTAHAITTA_KEY,
  HANKE_KAISTAPITUUSHAITTA_KEY,
  HANKE_MELUHAITTA_KEY,
  HANKE_POLYHAITTA_KEY,
  HANKE_STATUS_KEY,
  HANKE_TARINAHAITTA_KEY,
  HANKE_TYOMAATYYPPI_KEY,
  HANKE_VAIHE_KEY,
} from '../../types/hanke';
import {
  CONTACT_FORMFIELD,
  FORMFIELD,
  HANKE_PAGES,
  HankeDataFormState,
  YHTEYSHENKILO_FORMFIELD,
} from './types';
import { HaittaIndexData } from '../../common/haittaIndexes/types';

export const yhteyshenkiloSchema = yup.object({
  [YHTEYSHENKILO_FORMFIELD.ETUNIMI]: yup.string().max(50).required(),
  [YHTEYSHENKILO_FORMFIELD.SUKUNIMI]: yup.string().max(50).required(),
  [YHTEYSHENKILO_FORMFIELD.EMAIL]: yup.string().email().max(100).uniqueEmail().required(),
  [YHTEYSHENKILO_FORMFIELD.PUHELINNUMERO]: yup.string().phone().max(20).required(),
});

const yhteystietoSchema = yup.object({
  [CONTACT_FORMFIELD.NIMI]: yup
    .string()
    .required()
    .max(100)
    .meta({ pageName: HANKE_PAGES.YHTEYSTIEDOT }),
  [CONTACT_FORMFIELD.TYYPPI]: yup.mixed<keyof typeof CONTACT_TYYPPI>().defined().nullable(),
  [CONTACT_FORMFIELD.TUNNUS]: yup
    .string()
    .defined()
    .nullable()
    .when('tyyppi', {
      is: (value: string) => value === CONTACT_TYYPPI.YRITYS || value === CONTACT_TYYPPI.YHTEISO,
      then: (schema) => schema.businessId().required(),
    })
    .meta({ pageName: HANKE_PAGES.YHTEYSTIEDOT }),
  [CONTACT_FORMFIELD.EMAIL]: yup
    .string()
    .email()
    .required()
    .max(100)
    .meta({ pageName: HANKE_PAGES.YHTEYSTIEDOT }),
  [CONTACT_FORMFIELD.PUHELINNUMERO]: yup.string().phone().defined().max(20),
  id: yup.number(),
});

const muuYhteystietoSchema = yhteystietoSchema
  .omit([CONTACT_FORMFIELD.TYYPPI, CONTACT_FORMFIELD.TUNNUS])
  .shape({
    [CONTACT_FORMFIELD.ROOLI]: yup.string().required().meta({ pageName: HANKE_PAGES.YHTEYSTIEDOT }),
    [CONTACT_FORMFIELD.ORGANISAATIO]: yup.string().defined(),
    [CONTACT_FORMFIELD.OSASTO]: yup.string().defined(),
  });

const haittojenhallintaSchema = yup.object({
  [HAITTOJENHALLINTATYYPPI.YLEINEN]: yup
    .string()
    .required()
    .meta({ pageName: HANKE_PAGES.HAITTOJEN_HALLINTA }),
  [HAITTOJENHALLINTATYYPPI.PYORALIIKENNE]: yup
    .string()
    .detectedTrafficNuisance(HAITTOJENHALLINTATYYPPI.PYORALIIKENNE)
    .meta({ pageName: HANKE_PAGES.HAITTOJEN_HALLINTA }),
  [HAITTOJENHALLINTATYYPPI.AUTOLIIKENNE]: yup
    .string()
    .detectedTrafficNuisance(HAITTOJENHALLINTATYYPPI.AUTOLIIKENNE)
    .meta({ pageName: HANKE_PAGES.HAITTOJEN_HALLINTA }),
  [HAITTOJENHALLINTATYYPPI.RAITIOLIIKENNE]: yup
    .string()
    .detectedTrafficNuisance(HAITTOJENHALLINTATYYPPI.RAITIOLIIKENNE)
    .meta({ pageName: HANKE_PAGES.HAITTOJEN_HALLINTA }),
  [HAITTOJENHALLINTATYYPPI.LINJAAUTOLIIKENNE]: yup
    .string()
    .detectedTrafficNuisance(HAITTOJENHALLINTATYYPPI.LINJAAUTOLIIKENNE)
    .meta({ pageName: HANKE_PAGES.HAITTOJEN_HALLINTA }),
  [HAITTOJENHALLINTATYYPPI.MUUT]: yup
    .string()
    .required()
    .meta({ pageName: HANKE_PAGES.HAITTOJEN_HALLINTA }),
});

export const hankeAlueetSchema = yup.object({
  [FORMFIELD.NIMI]: yup.string().nullable(),
  [FORMFIELD.HAITTA_ALKU_PVM]: yup.date().required().meta({ pageName: HANKE_PAGES.ALUEET }),
  [FORMFIELD.HAITTA_LOPPU_PVM]: yup
    .date()
    .when(FORMFIELD.HAITTA_ALKU_PVM, (alkuPvm: Date[], schema: yup.DateSchema) => {
      try {
        return alkuPvm ? schema.min(alkuPvm) : schema;
      } catch (error) {
        return schema;
      }
    })
    .required()
    .meta({ pageName: HANKE_PAGES.ALUEET }),
  [FORMFIELD.MELUHAITTA]: yup
    .mixed<HANKE_MELUHAITTA_KEY>()
    .required()
    .meta({ pageName: HANKE_PAGES.ALUEET }),
  [FORMFIELD.POLYHAITTA]: yup
    .mixed<HANKE_POLYHAITTA_KEY>()
    .required()
    .meta({ pageName: HANKE_PAGES.ALUEET }),
  [FORMFIELD.TARINAHAITTA]: yup
    .mixed<HANKE_TARINAHAITTA_KEY>()
    .required()
    .meta({ pageName: HANKE_PAGES.ALUEET }),
  [FORMFIELD.KAISTAHAITTA]: yup
    .mixed<HANKE_KAISTAHAITTA_KEY>()
    .required()
    .meta({ pageName: HANKE_PAGES.ALUEET }),
  [FORMFIELD.KAISTAPITUUSHAITTA]: yup
    .mixed<HANKE_KAISTAPITUUSHAITTA_KEY>()
    .required()
    .meta({ pageName: HANKE_PAGES.ALUEET }),
  [FORMFIELD.HAITTOJENHALLINTASUUNNITELMA]: haittojenhallintaSchema,
  id: yup.number().defined().nullable(),
});

export const hankeSchema: yup.ObjectSchema<HankeDataFormState> = yup.object().shape({
  [FORMFIELD.NIMI]: yup.string().required().min(3).meta({ pageName: HANKE_PAGES.PERUSTIEDOT }),
  [FORMFIELD.KUVAUS]: yup.string().required().meta({ pageName: HANKE_PAGES.PERUSTIEDOT }),
  [FORMFIELD.KATUOSOITE]: yup.string().required().meta({ pageName: HANKE_PAGES.PERUSTIEDOT }),
  [FORMFIELD.VAIHE]: yup
    .mixed<HANKE_VAIHE_KEY>()
    .required()
    .meta({ pageName: HANKE_PAGES.PERUSTIEDOT }),
  [FORMFIELD.HANKEALUEET]: yup
    .array(hankeAlueetSchema)
    .min(1)
    .meta({ pageName: [HANKE_PAGES.ALUEET, HANKE_PAGES.HAITTOJEN_HALLINTA] }),
  [FORMFIELD.OMISTAJAT]: yup
    .array(yhteystietoSchema)
    .defined()
    .min(1)
    .meta({ pageName: HANKE_PAGES.YHTEYSTIEDOT }),
  [FORMFIELD.RAKENNUTTAJAT]: yup.array(yhteystietoSchema).defined(),
  [FORMFIELD.TOTEUTTAJAT]: yup.array(yhteystietoSchema).defined(),
  [FORMFIELD.MUUTTAHOT]: yup.array(muuYhteystietoSchema).defined(),
  geometriesChanged: yup.boolean(),
  id: yup.number(),
  hankeTunnus: yup.string(),
  onYKTHanke: yup.boolean().nullable(),
  alkuPvm: yup.string().nullable(),
  loppuPvm: yup.string().nullable(),
  tyomaaTyyppi: yup.mixed<HANKE_TYOMAATYYPPI_KEY[]>(),
  tormaystarkasteluTulos: yup.mixed<HaittaIndexData>().nullable(),
  status: yup.mixed<HANKE_STATUS_KEY>(),
  version: yup.number(),
  createdBy: yup.string(),
  createdAt: yup.string(),
  modifiedBy: yup.string(),
  modifiedAt: yup.string(),
  generated: yup.boolean(),
});

export const hankePerustiedotPublicSchema = hankeSchema.pick([
  FORMFIELD.NIMI,
  FORMFIELD.KUVAUS,
  FORMFIELD.KATUOSOITE,
  FORMFIELD.VAIHE,
]);

export const hankeAlueetPublicSchema = yup.object({
  [FORMFIELD.HANKEALUEET]: yup
    .array(hankeAlueetSchema.omit([FORMFIELD.HAITTOJENHALLINTASUUNNITELMA]))
    .min(1),
});

export const haittojenhallintaPublicSchema = yup.object({
  [FORMFIELD.HANKEALUEET]: yup
    .array(hankeAlueetSchema.pick([FORMFIELD.HAITTOJENHALLINTASUUNNITELMA]))
    .min(1),
});

export const hankeYhteystiedotPublicSchema = hankeSchema.pick([
  FORMFIELD.OMISTAJAT,
  FORMFIELD.RAKENNUTTAJAT,
  FORMFIELD.TOTEUTTAJAT,
  FORMFIELD.MUUTTAHOT,
]);

export const newHankeSchema = yup.object({
  nimi: yup.string().min(3).required(),
  perustaja: yup.object({
    sahkoposti: yup.string().email().required(),
    puhelinnumero: yup.string().phone().required(),
  }),
});
