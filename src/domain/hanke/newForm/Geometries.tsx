import { useFormikContext } from 'formik';
import { TextArea } from 'hds-react';
import React from 'react';
import { HakemusFormValues } from './types';

const Geometries: React.FC = () => {
  const formik = useFormikContext<HakemusFormValues>();
  return (
    <div>
      <h1>Geometrioiden piirto kartalle</h1>
      <TextArea
        id="kuvaus"
        label="Kuvaus"
        placeholder="Kuvaus tehtävistä töistä"
        helperText="Helper text"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.kuvaus}
      />
    </div>
  );
};
export default Geometries;
