import startOfDay from 'date-fns/startOfDay';
import endOfDay from 'date-fns/endOfDay';
import { $enum } from 'ts-enum-util';
import yup from '../../../common/utils/yup';
import { HANKE_VAIHE, HANKE_SUUNNITTELUVAIHE, CONTACT_TYYPPI } from '../../types/hanke';
import { FORMFIELD } from './types';

export const today = startOfDay(new Date());

const subContactSchema = yup
  .object()
  .nullable()
  .default(null)
  .shape({
    nimi: yup.string().max(100).required(),
    osoite: yup.string(),
    postiNro: yup.string(),
    postiTmPaikka: yup.string(),
    email: yup.string().email().max(100).required(),
    puhelinnumero: yup.string().nullable().default(null).max(20),
  });

const ownerSchema = subContactSchema.shape({
  tyyppi: yup.string().oneOf($enum(CONTACT_TYYPPI).getValues()).required(),
  yTunnus: yup.string().required(),
  subContact: subContactSchema,
});

const contactSchema = ownerSchema.shape({
  subContacts: yup.array().ensure().of(subContactSchema),
});

const otherPartySchema = contactSchema
  .omit(['tyyppi', 'yTunnus', 'osoite', 'postiNro', 'postiTmPaikka'])
  .shape({
    rooli: yup.string().required(),
    organisaatio: yup.string(),
    osasto: yup.string(),
  });

export const hankeSchema = yup.object().shape({
  [FORMFIELD.NIMI]: yup.string().min(3).required(),
  [FORMFIELD.KUVAUS]: yup.string().required().min(1),
  [FORMFIELD.KATUOSOITE]: yup.string().required(),
  [FORMFIELD.ALKU_PVM]: yup.date().nullable().required().min(today),
  [FORMFIELD.LOPPU_PVM]: yup
    .date()
    .nullable()
    .required()
    .when(
      FORMFIELD.ALKU_PVM,
      // eslint-disable-next-line
      // @ts-ignore nullable doesnt work with TS
      (alkuPvm: Date, schema: yup.DateSchema) => {
        try {
          return alkuPvm ? schema.min(alkuPvm) : schema;
        } catch (error) {
          return schema;
        }
      }
    ),
  [FORMFIELD.VAIHE]: yup.mixed().oneOf($enum(HANKE_VAIHE).getValues()).required(),
  [FORMFIELD.SUUNNITTELUVAIHE]: yup
    .mixed()
    .nullable()
    .when([FORMFIELD.VAIHE], {
      is: HANKE_VAIHE.SUUNNITTELU,
      then: yup.mixed().oneOf($enum(HANKE_SUUNNITTELUVAIHE).getValues()),
    }),
  [FORMFIELD.SUUNNITTELUVAIHE]: yup.string().nullable().when([FORMFIELD.VAIHE], {
    is: 'SUUNNITTELU',
    then: yup.string().required(),
  }),
  [FORMFIELD.OMISTAJA]: ownerSchema,
  [FORMFIELD.RAKENNUTTAJAT]: yup.array().ensure().of(contactSchema),
  [FORMFIELD.TOTEUTTAJAT]: yup.array().ensure().of(contactSchema),
  [FORMFIELD.MUUTTAHOT]: yup.array().ensure().of(otherPartySchema),
  [FORMFIELD.HAITTA_ALKU_PVM]: yup
    .date()
    .nullable()
    .when(
      ['$currentFormPage', FORMFIELD.ALKU_PVM, FORMFIELD.LOPPU_PVM],
      // eslint-disable-next-line
      // @ts-ignore nullable doesnt work with TS
      (currentFormPage: number, alkuPvm: Date, loppuPvm: Date, schema: yup.DateSchema) => {
        if (currentFormPage !== 4) return schema;
        return alkuPvm
          ? schema.min(startOfDay(new Date(alkuPvm))).max(endOfDay(new Date(loppuPvm)))
          : schema;
      }
    ),
  [FORMFIELD.HAITTA_LOPPU_PVM]: yup
    .date()
    .nullable()
    .when(
      ['$currentFormPage', FORMFIELD.ALKU_PVM, FORMFIELD.LOPPU_PVM],
      // eslint-disable-next-line
      // @ts-ignore nullable doesnt work with TS
      (currentFormPage: number, alkuPvm: Date, loppuPvm: Date, schema: yup.DateSchema) => {
        if (currentFormPage !== 4) return schema;
        return loppuPvm
          ? schema.min(startOfDay(new Date(alkuPvm))).max(endOfDay(new Date(loppuPvm)))
          : schema;
      }
    ),
});
