import { useFormikContext } from 'formik';
import { TextArea } from 'hds-react';
import React from 'react';
import { HakemusFormValues } from './types';

const Attachments: React.FC = () => {
  const formik = useFormikContext<HakemusFormValues>();
  return (
    <div>
      <h1>Attachments</h1>
      <TextArea
        id="kuvaus"
        label="kuvaus"
        placeholder="This is kuvaus again"
        helperText="Helper text"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.kuvaus}
      />
    </div>
  );
};
export default Attachments;
