import React, { useRef } from 'react';
import { useFormikContext } from 'formik';
import { Checkbox, TextArea, TextInput, DateInput, Select } from 'hds-react';
import { $enum } from 'ts-enum-util';
import * as Yup from 'yup';
import { startOfDay } from 'date-fns';
import {
  HakemusFormValues,
  HANKE_SUUNNITTELUVAIHE,
  HANKE_SUUNNITTELUVAIHE_KEY,
  HANKE_VAIHE,
  HANKE_VAIHE_KEY,
  Option,
} from './types';
import {
  convertFinnishDate,
  formatToFinnishDate,
  toEndOfDayUTCISO,
  toStartOfDayUTCISO,
} from '../../../common/utils/date';
import yup from '../../../common/utils/yup';

// TODO: add tooltips
// TODO: add validation error messages
// TODO: go through dynamic form example and see what is missing
// TODO: date input min and max validation based on set dates

export const today = startOfDay(new Date());

export const validationSchema = {
  nimi: Yup.string().required('Please enter a name for the hanke'),
  kuvaus: Yup.string().required('Please enter a kuvaus for the hanke'),
  alkuPvm: Yup.date().required('Hankkeella tulee olla aloituspäivämäärä').min(7),
  loppuPvm: Yup.date().required('Hankkeella tulee olla päättymispäivämäärä'),
  vaihe: Yup.mixed()
    .required('Hankkeen vaihe pitää olla asetettu')
    .oneOf($enum(HANKE_VAIHE).getValues()),
  suunnitteluVaihe: Yup.mixed()
    .nullable()
    .when(['vaihe'], { is: HANKE_VAIHE.SUUNNITTELU, then: yup.string().required() }),
};

export interface types {
  id: number | null;
  hankeTunnus: string;
  onYKTHanke: boolean;
  nimi: string;
  kuvaus: string;
  alkuPvm: string;
  loppuPvm: string;
  vaihe: HANKE_VAIHE_KEY | '';
  suunnitteluVaihe: HANKE_SUUNNITTELUVAIHE_KEY | null;
}

export const initialValues: types = {
  id: null,
  hankeTunnus: '',
  onYKTHanke: false,
  nimi: '',
  kuvaus: '',
  alkuPvm: '',
  loppuPvm: '',
  vaihe: '',
  suunnitteluVaihe: null,
};

export const BasicHankeInfo: React.FC = () => {
  const formik = useFormikContext<HakemusFormValues>();
  const alkuPvmInputIsDirty = useRef(false);
  const loppuPvmInputIsDirty = useRef(false);
  const getErrorMessage = (fieldname: keyof typeof initialValues) =>
    formik.touched[fieldname] ? formik.errors[fieldname] : undefined;
  return (
    <div>
      <TextInput
        id="hankeTunnus"
        label="Hankkeen tunnus"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.hankeTunnus}
        disabled
      />
      <Checkbox
        id="onYKTHanke"
        name="onYKTHanke"
        label="Hanke on YKT-hanke"
        checked={formik.values.onYKTHanke === true}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      <TextInput
        id="nimi"
        label="Nimi"
        placeholder="nimi"
        helperText="Hankkeen nimi"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.nimi}
        errorText={getErrorMessage('nimi')}
      />
      <TextArea
        id="kuvaus"
        label="Kuvaus"
        placeholder="name"
        helperText="Hankkeen kuvaus"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.kuvaus}
        errorText={getErrorMessage('kuvaus')}
      />
      <DateInput
        id="alkuPvm"
        name="alkuPvm"
        label="Hankkeen alkupäivä"
        minDate={new Date()}
        onChange={(date: string) => {
          const convertedDateString = convertFinnishDate(date);
          if (convertedDateString.length > 0) {
            formik.setFieldValue(
              'alkuPvm',
              toStartOfDayUTCISO(new Date(convertedDateString)) || ''
            );
          }
          alkuPvmInputIsDirty.current = true;
        }}
        onBlur={() => {
          if (alkuPvmInputIsDirty.current) {
            formik.handleBlur({ target: { name: 'alkuPvm' } });
          }
        }}
        value={!formik.values.alkuPvm ? undefined : formatToFinnishDate(formik.values.alkuPvm)}
        required
        errorText={getErrorMessage('alkuPvm')}
      />
      <DateInput
        id="loppuPvm"
        name="loppuPvm"
        label="Hankkeen loppupäivä"
        minDate={new Date()}
        onChange={(date: string) => {
          const convertedDateString = convertFinnishDate(date);
          if (convertedDateString.length > 0) {
            formik.setFieldValue('loppuPvm', toEndOfDayUTCISO(new Date(convertedDateString)) || '');
          }
          loppuPvmInputIsDirty.current = true;
        }}
        onBlur={() => {
          if (loppuPvmInputIsDirty.current) {
            formik.handleBlur({ target: { name: 'loppuPvm' } });
          }
        }}
        value={!formik.values.loppuPvm ? undefined : formatToFinnishDate(formik.values.loppuPvm)}
        required
        errorText={getErrorMessage('loppuPvm')}
      />
      <Select
        required
        label="Hankkeen vaihe"
        options={$enum(HANKE_VAIHE).map((value) => ({
          value,
          label: value,
        }))}
        onChange={(selection: Option) => {
          if (selection.value !== HANKE_VAIHE.SUUNNITTELU) {
            formik.setFieldValue('suunnitteluVaihe', null);
          }
          formik.setFieldValue('vaihe', selection.value);
        }}
        error={getErrorMessage('vaihe')}
        invalid={!!getErrorMessage('vaihe')}
      />
      <Select
        required
        label="Hankkeen suunnitteluvaihe"
        disabled={!(HANKE_VAIHE.SUUNNITTELU === formik.values.vaihe)}
        options={$enum(HANKE_SUUNNITTELUVAIHE).map((value) => ({
          value,
          label: value,
        }))}
        onChange={(selection: Option) => {
          formik.setFieldValue('suunnitteluVaihe', selection.value);
        }}
      />
    </div>
  );
};
