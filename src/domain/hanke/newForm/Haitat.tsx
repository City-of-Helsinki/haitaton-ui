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
  return (
    <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={10}>
      <DateInput
        id="haittaAlkuPvm"
        name="haittaAlkuPvm"
        label="Haitan alkupäivämäärä"
        minDate={new Date()}
        onChange={(date: string) => {
          const convertedDateString = convertFinnishDate(date);
          if (convertedDateString.length > 0) {
            formik.setFieldValue(
              'haittaAlkuPvm',
              toStartOfDayUTCISO(new Date(convertedDateString)) || ''
            );
          }
          haittaAlkuPvmIsDirty.current = true;
        }}
        onBlur={() => {
          if (haittaAlkuPvmIsDirty.current) {
            formik.handleBlur({ target: { name: 'haittaAlkuPvm' } });
          }
        }}
        value={
          !formik.values.haittaAlkuPvm
            ? undefined
            : formatToFinnishDate(formik.values.haittaAlkuPvm)
        }
        required
      />
      <DateInput
        id="haittaLoppuPvm"
        name="haittaLoppuPvm"
        label="Haitan loppupäivämäärä"
        minDate={new Date()}
        onChange={(date: string) => {
          const convertedDateString = convertFinnishDate(date);
          if (convertedDateString.length > 0) {
            formik.setFieldValue(
              'haittaLoppuPvm',
              toEndOfDayUTCISO(new Date(convertedDateString)) || ''
            );
          }
          haittaLoppuPvmIsDirty.current = true;
        }}
        onBlur={() => {
          if (haittaLoppuPvmIsDirty.current) {
            formik.handleBlur({ target: { name: 'haittaLoppuPvm' } });
          }
        }}
        value={
          !formik.values.haittaLoppuPvm
            ? undefined
            : formatToFinnishDate(formik.values.haittaLoppuPvm)
        }
        required
      />
      <Select
        required
        id="kaistaHaitta"
        label="Kaistahaitta"
        options={$enum(HANKE_KAISTAHAITTA).map((value) => ({
          value,
          label: t(`hanke:kaistaHaitta:${value}`),
        }))}
        onChange={(option: Option) => {
          formik.setFieldValue('kaistaHaitta', option.value);
        }}
      />
      <Select
        required
        id="kaistaPituusHaitta"
        label="Kaistan pituushaitta"
        options={$enum(HANKE_KAISTAPITUUSHAITTA).map((value) => ({
          value,
          label: t(`hanke:kaistaPituusHaitta:${value}`),
        }))}
        onChange={(option: Option) => {
          formik.setFieldValue('kaistaPituusHaitta', option.value);
        }}
      />
      <Select
        required
        id="meluHaitta"
        label="Meluhaitta"
        options={$enum(HANKE_MELUHAITTA).map((value) => ({
          value,
          label: t(`hanke:meluHaitta:${value}`),
        }))}
        onChange={(option: Option) => {
          formik.setFieldValue('meluHaitta', option.value);
        }}
      />
      <Select
        required
        id="polyHaitta"
        label="Pölyhaitta"
        options={$enum(HANKE_POLYHAITTA).map((value) => ({
          value,
          label: t(`hanke:polyHaitta:${value}`),
        }))}
        onChange={(option: Option) => {
          formik.setFieldValue('polyHaitta', option.value);
        }}
      />
      <Select
        required
        id="tarinaHaitta"
        label="Tärinähaitta"
        options={$enum(HANKE_TARINAHAITTA).map((value) => ({
          value,
          label: t(`hanke:tarinaHaitta:${value}`),
        }))}
        onChange={(option: Option) => {
          formik.setFieldValue('tarinaHaitta', option.value);
        }}
      />
    </Grid>
  );
};
export default Haitat;
