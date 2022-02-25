import React, { useRef } from 'react';
import { useFormikContext } from 'formik';
import { Checkbox, TextArea, TextInput, DateInput, Select } from 'hds-react';
import { $enum } from 'ts-enum-util';
import { HakemusFormValues, HANKE_SUUNNITTELUVAIHE, HANKE_VAIHE, Option } from './types';

// TODO: add tooltips
// TODO: add validation error messages
// TODO: go through dynamic form example and see what is missing
// TODO: date input min and max validation based on set dates

const BasicHankeInfo: React.FC = () => {
  const formik = useFormikContext<HakemusFormValues>();
  const alkuPvmInputIsDirty = useRef(false);
  const loppuPvmInputIsDirty = useRef(false);
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
      />
      <TextArea
        id="kuvaus"
        label="Kuvaus"
        placeholder="name"
        helperText="Hankkeen kuvaus"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.kuvaus}
      />
      <DateInput
        id="alkuPvm"
        name="alkuPvm"
        label="Hankkeen alkupäivä"
        minDate={new Date()}
        onChange={(value) => {
          alkuPvmInputIsDirty.current = true;
          formik.setFieldValue('alkuPvm', value || '');
        }}
        onBlur={() => {
          if (alkuPvmInputIsDirty.current) {
            formik.handleBlur({ target: { name: 'alkuPvm' } });
          }
        }}
        value={formik.values.alkuPvm}
        required
      />
      <DateInput
        id="loppuPvm"
        name="loppuPvm"
        label="Hankkeen loppupäivä"
        minDate={new Date()}
        onChange={(value) => {
          loppuPvmInputIsDirty.current = true;
          formik.setFieldValue('loppuPvm', value || '');
        }}
        onBlur={() => {
          if (loppuPvmInputIsDirty.current) {
            formik.handleBlur({ target: { name: 'loppuPvm' } });
          }
        }}
        value={formik.values.loppuPvm}
        required
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
export default BasicHankeInfo;
