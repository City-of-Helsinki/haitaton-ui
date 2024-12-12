import yup from '../../common/utils/yup';
import { TaydennysAttachmentMetadata } from '../application/taydennys/types';
import { johtoselvitysApplicationDataSchema } from '../johtoselvitys/validationSchema';
import { JohtoselvitysTaydennysFormValues } from './types';

export const validationSchema: yup.ObjectSchema<JohtoselvitysTaydennysFormValues> = yup.object({
  id: yup.string().defined(),
  applicationData: johtoselvitysApplicationDataSchema,
  muutokset: yup.array(yup.string().defined()).defined(),
  liitteet: yup.array(yup.mixed<TaydennysAttachmentMetadata>().defined()).defined(),
  selfIntersectingPolygon: yup.boolean().isFalse(),
  geometriesChanged: yup.boolean(),
});
