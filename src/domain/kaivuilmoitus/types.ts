import { Application, KaivuilmoitusData } from '../application/types/application';

export interface KaivuilmoitusFormValues extends Application<KaivuilmoitusData> {
  geometriesChanged?: boolean; // virtualField
  selfIntersectingPolygon?: boolean; // virtualField
}
