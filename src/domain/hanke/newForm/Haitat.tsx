import React, { useRef } from 'react';
import { useFormikContext } from 'formik';
import { Select, DateInput } from 'hds-react';
import { $enum } from 'ts-enum-util';
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

const Haitat: React.FC = () => {
  const formik = useFormikContext<HakemusFormValues>();
  const haittaAlkuPvmIsDirty = useRef(false);
  const haittaLoppuPvmIsDirty = useRef(false);
  return (
    <div>
      <h1>Hankkeen haitat</h1>
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
        label="Kaistahaitta"
        options={$enum(HANKE_KAISTAHAITTA).map((value) => ({
          value,
          label: value,
        }))}
        onChange={(option: Option) => {
          formik.setFieldValue('kaistaHaitta', option.value);
        }}
      />
      <Select
        required
        label="Kaistan pituushaitta"
        options={$enum(HANKE_KAISTAPITUUSHAITTA).map((value) => ({
          value,
          label: value,
        }))}
        onChange={(option: Option) => {
          formik.setFieldValue('kaistaPituusHaitta', option.value);
        }}
      />
      <Select
        required
        label="Meluhaitta"
        options={$enum(HANKE_MELUHAITTA).map((value) => ({
          value,
          label: value,
        }))}
        onChange={(option: Option) => {
          formik.setFieldValue('meluHaitta', option.value);
        }}
      />
      <Select
        required
        label="Pölyhaitta"
        options={$enum(HANKE_POLYHAITTA).map((value) => ({
          value,
          label: value,
        }))}
        onChange={(option: Option) => {
          formik.setFieldValue('polyHaitta', option.value);
        }}
      />
      <Select
        required
        label="Tärinähaitta"
        options={$enum(HANKE_TARINAHAITTA).map((value) => ({
          value,
          label: value,
        }))}
        onChange={(option: Option) => {
          formik.setFieldValue('tarinaHaitta', option.value);
        }}
      />
    </div>
  );
};
export default Haitat;
