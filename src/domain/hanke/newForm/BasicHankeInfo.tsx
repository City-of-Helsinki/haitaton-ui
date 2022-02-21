import React from 'react';
import { useFormikContext } from 'formik';
import { TextArea, TextInput } from 'hds-react';
import { HakemusFormValues } from './types';

const BasicHankeInfo: React.FC = () => {
  const formik = useFormikContext<HakemusFormValues>();
  return (
    <div>
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
    </div>
  );
};
export default BasicHankeInfo;
