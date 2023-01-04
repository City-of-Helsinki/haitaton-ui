import React from 'react';
import { useFormikContext } from 'formik';
import { JohtoselvitysFormValues } from './types';

export const ReviewAndSend: React.FC = () => {
  const formik = useFormikContext<JohtoselvitysFormValues>();

  return (
    <div>
      <div style={{ fontSize: 'var(--fontsize-body-m)', fontWeight: 500 }}>Annetut tiedot</div>
      <p>{JSON.stringify(formik.values)}</p>
    </div>
  );
};

export default ReviewAndSend;
