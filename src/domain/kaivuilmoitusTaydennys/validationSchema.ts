import yup from '../../common/utils/yup';
import { applicationDataSchema } from '../kaivuilmoitus/validationSchema';
import { KaivuilmoitusTaydennysFormValues } from './types';
import { TaydennysAttachmentMetadata } from '../application/taydennys/types';

export const validationSchema: yup.ObjectSchema<KaivuilmoitusTaydennysFormValues> = yup.object({
  id: yup.string().defined(),
  applicationData: applicationDataSchema,
  muutokset: yup.array(yup.string().defined()).defined(),
  liitteet: yup.array(yup.mixed<TaydennysAttachmentMetadata>().defined()).defined(),
  selfIntersectingPolygon: yup.boolean().isFalse(),
  geometriesChanged: yup.boolean(),
});
