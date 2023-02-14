import { Application, JohtoselvitysData } from '../application/types/application';

export interface JohtoselvitysFormValues extends Application {
  applicationData: JohtoselvitysData;
}
