import { useFormikContext } from 'formik';
import { TextInput, Select, Combobox } from 'hds-react';
import React from 'react';
import { $enum } from 'ts-enum-util';
import { HakemusFormValues, HANKE_TYOMAAKOKO, HANKE_TYOMAATYYPPI } from './types';

type Option = { value: string; label: string };

export const initialValues = { tyomaaKatuosoite: '', tyomaaTyyppi: [], tyomaaKoko: null };

export const AdditionalInformation: React.FC = () => {
  const formik = useFormikContext<HakemusFormValues>();
  return (
    <div>
      <h1>Hankkeen lisätiedot</h1>
      <TextInput
        id="tyomaaKatuosoite"
        label="Katuosoite"
        required
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.tyomaaKatuosoite}
      />
      <Combobox<Option>
        multiselect
        required
        label="Työmaan tyyppi"
        clearButtonAriaLabel="Clear all selections"
        selectedItemRemoveButtonAriaLabel="Remove value"
        toggleButtonAriaLabel="Toggle menu"
        options={$enum(HANKE_TYOMAATYYPPI).map((value) => ({
          value,
          label: value,
        }))}
        onChange={(selection: Option[]) => {
          formik.setFieldValue(
            'tyomaaTyyppi',
            selection.map((option) => option.value)
          );
        }}
      />
      <Select
        required
        label="Työmaan koko"
        options={$enum(HANKE_TYOMAAKOKO).map((value) => ({
          value,
          label: value,
        }))}
        onChange={(selection: Option) => {
          formik.setFieldValue('tyomaaKoko', selection.value);
        }}
      />
    </div>
  );
};
export default AdditionalInformation;
