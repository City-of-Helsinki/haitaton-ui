import { useEffect, useState } from 'react';
import { HankeData } from '../../../types/hanke';
import { hankeSchema } from '../hankeSchema';

/**
 * Check that hanke data is valid against hanke yup schema
 */
export function useIsHankeValid(hanke: HankeData | undefined) {
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    hankeSchema.isValid(hanke).then((valid) => {
      setIsValid(valid);
    });
  }, [hanke]);

  return isValid;
}
