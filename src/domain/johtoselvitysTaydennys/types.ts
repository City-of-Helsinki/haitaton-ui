import { JohtoselvitysFormData } from '../johtoselvitys/types';

export interface JohtoselvitysTaydennysFormValues {
  id: string;
  applicationData: JohtoselvitysFormData;
  geometriesChanged?: boolean; // virtualField
  selfIntersectingPolygon?: boolean; // virtualField
}
