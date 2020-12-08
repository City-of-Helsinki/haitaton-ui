import * as yup from 'yup';
import { FORMFIELD } from './types';

export const schema = yup.object().shape({
  [FORMFIELD.NIMI]: yup.string().required().length(3),
  [FORMFIELD.ALKU_PVM]: yup.string().required(),
  [FORMFIELD.LOPPU_PVM]: yup.string().required(),
});
