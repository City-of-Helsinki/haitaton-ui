import yup from '../../common/utils/yup';
import { applicationDataSchema } from '../kaivuilmoitus/validationSchema';
import { KaivuilmoitusMuutosilmoitusFormValues } from './types';

export const validationSchema: yup.ObjectSchema<KaivuilmoitusMuutosilmoitusFormValues> = yup.object(
  {
    id: yup.string().defined(),
    applicationData: applicationDataSchema,
    muutokset: yup.array(yup.string().defined()).defined(),
    selfIntersectingPolygon: yup.boolean().isFalse(),
    geometriesChanged: yup.boolean(),
  },
);
