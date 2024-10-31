import yup from '../../common/utils/yup';
import { johtoselvitysApplicationDataSchema } from '../johtoselvitys/validationSchema';
import { JohtoselvitysTaydennysFormValues } from './types';

export const validationSchema: yup.ObjectSchema<JohtoselvitysTaydennysFormValues> = yup.object({
  id: yup.string().defined(),
  applicationData: johtoselvitysApplicationDataSchema,
  selfIntersectingPolygon: yup.boolean().isFalse(),
  geometriesChanged: yup.boolean(),
});
