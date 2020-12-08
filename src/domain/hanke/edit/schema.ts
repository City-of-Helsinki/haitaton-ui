import yup from '../../../common/utils/yup';
import { FORMFIELD } from './types';

export const schema = yup.object().shape({
  [FORMFIELD.NIMI]: yup.string().required().min(3),
  [FORMFIELD.ALKU_PVM]: yup.string().required(),
  [FORMFIELD.LOPPU_PVM]: yup.string().required(),
});
