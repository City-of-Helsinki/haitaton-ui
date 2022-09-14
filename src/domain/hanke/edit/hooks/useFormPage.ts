import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

export const useFormPage = () => {
  const { trigger: triggerValidations } = useFormContext();

  // Trigger form validations when page unmounts
  useEffect(() => {
    return () => {
      triggerValidations();
    };
  }, [triggerValidations]);
};
