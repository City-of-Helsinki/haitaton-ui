import { JohtoselvitysFormData } from '../johtoselvitys/types';

export interface JohtoselvitysTaydennysFormValues {
  id: string;
  applicationData: JohtoselvitysFormData;
  muutokset: string[];
  geometriesChanged?: boolean; // virtualField
  selfIntersectingPolygon?: boolean; // virtualField
}
