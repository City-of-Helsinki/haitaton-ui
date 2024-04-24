import yup from '../../../common/utils/yup';
import {
  HANKE_KAISTAHAITTA_KEY,
  HANKE_KAISTAPITUUSHAITTA_KEY,
  HANKE_MELUHAITTA_KEY,
  HANKE_POLYHAITTA_KEY,
  HANKE_STATUS_KEY,
  HANKE_TARINAHAITTA_KEY,
  HANKE_TYOMAATYYPPI_KEY,
  HANKE_VAIHE_KEY,
  HankeIndexData,
} from './../../types/hanke';
import { CONTACT_TYYPPI } from '../../types/hanke';
import { FORMFIELD, CONTACT_FORMFIELD, YHTEYSHENKILO_FORMFIELD, HankeDataFormState } from './types';
import isValidBusinessId from '../../../common/utils/isValidBusinessId';

export const yhteyshenkiloSchema = yup.object({
  [YHTEYSHENKILO_FORMFIELD.ETUNIMI]: yup.string().max(50).required(),
  [YHTEYSHENKILO_FORMFIELD.SUKUNIMI]: yup.string().max(50).required(),
  [YHTEYSHENKILO_FORMFIELD.EMAIL]: yup.string().email().max(100).required(),
  [YHTEYSHENKILO_FORMFIELD.PUHELINNUMERO]: yup.string().max(20).required(),
});

const contactSchema = yup.object({
  [CONTACT_FORMFIELD.NIMI]: yup.string().defined().max(100),
  [CONTACT_FORMFIELD.TYYPPI]: yup.mixed<keyof typeof CONTACT_TYYPPI>().defined().nullable(),
  [CONTACT_FORMFIELD.TUNNUS]: yup
    .string()
    .defined()
    .nullable()
    .when('tyyppi', {
      is: (value: string) => value === CONTACT_TYYPPI.YRITYS || value === CONTACT_TYYPPI.YHTEISO,
      then: (schema) =>
        schema.test('is-business-id', 'Is not valid business id', isValidBusinessId),
      otherwise: (schema) => schema,
    }),
  [CONTACT_FORMFIELD.EMAIL]: yup.string().email().defined().max(100),
  [CONTACT_FORMFIELD.PUHELINNUMERO]: yup.string().defined().max(20),
  id: yup.number(),
});

const otherPartySchema = contactSchema
  .omit([CONTACT_FORMFIELD.TYYPPI, CONTACT_FORMFIELD.TUNNUS])
  .shape({
    [CONTACT_FORMFIELD.NIMI]: yup.string().defined().max(100),
    [CONTACT_FORMFIELD.ROOLI]: yup.string().defined(),
    [CONTACT_FORMFIELD.ORGANISAATIO]: yup.string().defined(),
    [CONTACT_FORMFIELD.OSASTO]: yup.string().defined(),
  });

export const hankeAlueSchema = yup.object({
  [FORMFIELD.NIMI]: yup.string().nullable(),
  [FORMFIELD.HAITTA_ALKU_PVM]: yup.date().defined().nullable(),
  [FORMFIELD.HAITTA_LOPPU_PVM]: yup
    .date()
    .defined()
    .when(FORMFIELD.HAITTA_ALKU_PVM, (alkuPvm: Date[], schema: yup.DateSchema) => {
      try {
        return alkuPvm ? schema.min(alkuPvm) : schema;
      } catch (error) {
        return schema;
      }
    })
    .nullable(),
  [FORMFIELD.MELUHAITTA]: yup.mixed<HANKE_MELUHAITTA_KEY>().defined().nullable(),
  [FORMFIELD.POLYHAITTA]: yup.mixed<HANKE_POLYHAITTA_KEY>().defined().nullable(),
  [FORMFIELD.TARINAHAITTA]: yup.mixed<HANKE_TARINAHAITTA_KEY>().defined().nullable(),
  [FORMFIELD.KAISTAHAITTA]: yup.mixed<HANKE_KAISTAHAITTA_KEY>().defined().nullable(),
  [FORMFIELD.KAISTAPITUUSHAITTA]: yup.mixed<HANKE_KAISTAPITUUSHAITTA_KEY>().defined().nullable(),
  id: yup.number().defined().nullable(),
});

export const hankeSchema: yup.ObjectSchema<HankeDataFormState> = yup.object().shape({
  [FORMFIELD.NIMI]: yup.string().min(3).defined().required(),
  [FORMFIELD.KUVAUS]: yup.string().nullable(),
  [FORMFIELD.KATUOSOITE]: yup.string().nullable(),
  [FORMFIELD.VAIHE]: yup.mixed<HANKE_VAIHE_KEY>().nullable(),
  [FORMFIELD.HANKEALUEET]: yup.array(hankeAlueSchema),
  [FORMFIELD.OMISTAJAT]: yup.array(contactSchema).defined(),
  [FORMFIELD.RAKENNUTTAJAT]: yup.array(contactSchema).defined(),
  [FORMFIELD.TOTEUTTAJAT]: yup.array(contactSchema).defined(),
  [FORMFIELD.MUUTTAHOT]: yup.array(otherPartySchema).defined(),
  geometriesChanged: yup.boolean(),
  id: yup.number(),
  hankeTunnus: yup.string(),
  onYKTHanke: yup.boolean().nullable(),
  alkuPvm: yup.string().nullable(),
  loppuPvm: yup.string().nullable(),
  tyomaaTyyppi: yup.mixed<HANKE_TYOMAATYYPPI_KEY[]>(),
  tormaystarkasteluTulos: yup.mixed<HankeIndexData>().nullable(),
  status: yup.mixed<HANKE_STATUS_KEY>(),
  version: yup.number(),
  createdBy: yup.string(),
  createdAt: yup.string(),
  modifiedBy: yup.string(),
  modifiedAt: yup.string(),
  generated: yup.boolean(),
});

export const newHankeSchema = yup.object({
  nimi: yup.string().min(3).required(),
  perustaja: yup.object({
    sahkoposti: yup.string().email().required(),
    puhelinnumero: yup.string().required(),
  }),
});
