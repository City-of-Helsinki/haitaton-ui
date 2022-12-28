import React from 'react';
import { useFormContext } from 'react-hook-form';
import { JohtoselvitysFormValues } from './types';

export const ReviewAndSend: React.FC = () => {
  const { getValues } = useFormContext<JohtoselvitysFormValues>();

  return (
    <div>
      <div style={{ fontSize: 'var(--fontsize-body-m)', fontWeight: 500 }}>Annetut tiedot</div>
      <p>{JSON.stringify(getValues())}</p>
    </div>
  );
};

export default ReviewAndSend;
