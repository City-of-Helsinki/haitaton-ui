import { useFormikContext } from 'formik';
import { TextArea } from 'hds-react';
import React from 'react';
import { HakemusFormValues } from './types';

const ContactDetails: React.FC = () => {
  const formik = useFormikContext<HakemusFormValues>();
  return (
    <div>
      <h1>ContactDetails</h1>
      <TextArea
        id="hakijanNimi"
        label="hakijannimi"
        placeholder="hakijannimi"
        helperText="Helper text"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.hakijanNimi}
      />
    </div>
  );
};
export default ContactDetails;
