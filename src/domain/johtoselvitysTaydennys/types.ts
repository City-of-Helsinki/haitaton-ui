import { JohtoselvitysFormData } from '../johtoselvitys/types';
import { TaydennysAttachmentMetadata } from '../application/taydennys/types';

export interface JohtoselvitysTaydennysFormValues {
  id: string;
  applicationData: JohtoselvitysFormData;
  muutokset: string[];
  liitteet: TaydennysAttachmentMetadata[];
  geometriesChanged?: boolean; // virtualField
  selfIntersectingPolygon?: boolean; // virtualField
}
