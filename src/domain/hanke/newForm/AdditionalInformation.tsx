import { useFormikContext } from 'formik';
import { TextInput, Select, Combobox } from 'hds-react';
import React from 'react';
import { $enum } from 'ts-enum-util';
import { HakemusFormValues, HANKE_TYOMAATYYPPI } from './types';

type Option = { value: string; label: string };

const AdditionalInformation: React.FC = () => {
  const formik = useFormikContext<HakemusFormValues>();
  return (
    <div>
      <h1>Hankkeen lisätiedot</h1>
      <TextInput
        id="osoite"
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
        onChange={() => {
          console.log('Muutuin');
        }}
      />
      <Select
        required
        label="Työmaan koko"
        options={[
          {
            label: 'Yksittäinen suppea kohde ja/tai pistemäinen työmaa',
            value: 'SUPPEA_TAI_PISTE',
          },
          {
            label: 'Työmaa-alueen pituus yli 10 m ja/tai korttelin mittainen työmaa',
            value: 'YLI_10M_TAI_KORTTELI',
          },
          {
            label: 'Työmaa ulottuu kadun eri puolille ja/tai usean korttelin mittainen työmaa',
            value: 'LAAJA_TAI_USEA_KORTTELI',
          },
        ]}
        onChange={(selection: any) => {
          formik.setFieldValue('vaihe', selection.value);
        }}
      />
    </div>
  );
};
export default AdditionalInformation;
