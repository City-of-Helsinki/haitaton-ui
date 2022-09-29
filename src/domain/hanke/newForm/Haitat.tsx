import React, { useRef } from 'react';
import { useFormikContext } from 'formik';
import { Select, DateInput } from 'hds-react';
import { $enum } from 'ts-enum-util';
import { Grid } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import {
  HakemusFormValues,
  HANKE_KAISTAHAITTA,
  HANKE_KAISTAPITUUSHAITTA,
  HANKE_MELUHAITTA,
  HANKE_POLYHAITTA,
  HANKE_TARINAHAITTA,
} from './types';
import {
  convertFinnishDate,
  formatToFinnishDate,
  toEndOfDayUTCISO,
  toStartOfDayUTCISO,
} from '../../../common/utils/date';

type Option = { value: string; label: string };

export const initialValues = {
  haittaAlkuPvm: '',
  haittaLoppuPvm: '',
  kaistaHaitta: null,
  kaistaPituusHaitta: null,
  meluHaitta: null,
  polyHaitta: null,
  tarinaHaitta: null,
};

export const Haitat: React.FC = () => {
  const { t } = useTranslation();
  const formik = useFormikContext<HakemusFormValues>();
  const haittaAlkuPvmIsDirty = useRef(false);
  const haittaLoppuPvmIsDirty = useRef(false);

  const {
    haittaAlkuPvm,
    haittaLoppuPvm,
    kaistaHaitta,
    kaistaPituusHaitta,
    meluHaitta,
    polyHaitta,
    tarinaHaitta,
  } = formik.values;

  return (
    <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={10}>
      <DateInput
        id="haittaAlkuPvm"
        name="haittaAlkuPvm"
        label={t('hankeForm:labels:haittaAlkuPvm')}
        minDate={new Date()}
        onChange={(date: string) => {
          const convertedDateString = convertFinnishDate(date);
          if (convertedDateString.length > 0) {
            formik.setFieldValue(
              'haittaAlkuPvm',
              toStartOfDayUTCISO(new Date(convertedDateString))
            );
          }
          haittaAlkuPvmIsDirty.current = true;
        }}
        onBlur={() => {
          if (haittaAlkuPvmIsDirty.current) {
            formik.handleBlur({ target: { name: 'haittaAlkuPvm' } });
          }
        }}
        value={!haittaAlkuPvm ? undefined : formatToFinnishDate(haittaAlkuPvm)}
        required
        disableConfirmation
      />
      <DateInput
        id="haittaLoppuPvm"
        name="haittaLoppuPvm"
        label={t('hankeForm:labels:haittaLoppuPvm')}
        minDate={new Date()}
        onChange={(date: string) => {
          const convertedDateString = convertFinnishDate(date);
          if (convertedDateString.length > 0) {
            formik.setFieldValue('haittaLoppuPvm', toEndOfDayUTCISO(new Date(convertedDateString)));
          }
          haittaLoppuPvmIsDirty.current = true;
        }}
        onBlur={() => {
          if (haittaLoppuPvmIsDirty.current) {
            formik.handleBlur({ target: { name: 'haittaLoppuPvm' } });
          }
        }}
        value={!haittaLoppuPvm ? undefined : formatToFinnishDate(haittaLoppuPvm)}
        required
        disableConfirmation
      />
      <Select
        required
        id="kaistaHaitta"
        label={t('hankeForm:labels:kaistaHaitta')}
        options={$enum(HANKE_KAISTAHAITTA).map((value) => ({
          value,
          label: t(`hanke:kaistaHaitta:${value}`),
        }))}
        onChange={(option: Option) => {
          formik.setFieldValue('kaistaHaitta', option.value);
        }}
        value={{
          value: kaistaHaitta || '',
          label: kaistaHaitta ? t(`hanke:kaistaHaitta:${kaistaHaitta}`) : '',
        }}
      />
      <Select
        required
        id="kaistaPituusHaitta"
        label={t('hankeForm:labels:kaistaPituusHaitta')}
        options={$enum(HANKE_KAISTAPITUUSHAITTA).map((value) => ({
          value,
          label: t(`hanke:kaistaPituusHaitta:${value}`),
        }))}
        onChange={(option: Option) => {
          formik.setFieldValue('kaistaPituusHaitta', option.value);
        }}
        value={{
          value: formik.values.kaistaPituusHaitta || '',
          label: kaistaPituusHaitta ? t(`hanke:kaistaPituusHaitta:${kaistaPituusHaitta}`) : '',
        }}
      />
      <Select
        required
        id="meluHaitta"
        label={t('hankeForm:labels:meluHaitta')}
        options={$enum(HANKE_MELUHAITTA).map((value) => ({
          value,
          label: t(`hanke:meluHaitta:${value}`),
        }))}
        onChange={(option: Option) => {
          formik.setFieldValue('meluHaitta', option.value);
        }}
        value={{
          value: meluHaitta || '',
          label: meluHaitta ? t(`hanke:meluHaitta:${meluHaitta}`) : '',
        }}
      />
      <Select
        required
        id="polyHaitta"
        label={t('hankeForm:labels:polyHaitta')}
        options={$enum(HANKE_POLYHAITTA).map((value) => ({
          value,
          label: t(`hanke:polyHaitta:${value}`),
        }))}
        onChange={(option: Option) => {
          formik.setFieldValue('polyHaitta', option.value);
        }}
        value={{
          value: polyHaitta || '',
          label: polyHaitta ? t(`hanke:polyHaitta:${polyHaitta}`) : '',
        }}
      />
      <Select
        required
        id="tarinaHaitta"
        label={t('hankeForm:labels:tarinaHaitta')}
        options={$enum(HANKE_TARINAHAITTA).map((value) => ({
          value,
          label: t(`hanke:tarinaHaitta:${value}`),
        }))}
        onChange={(option: Option) => {
          formik.setFieldValue('tarinaHaitta', option.value);
        }}
        value={{
          value: tarinaHaitta || '',
          label: tarinaHaitta ? t(`hanke:tarinaHaitta:${tarinaHaitta}`) : '',
        }}
      />
    </Grid>
  );
};
export default Haitat;
