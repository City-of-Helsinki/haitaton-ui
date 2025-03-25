import { Application, KaivuilmoitusData } from '../application/types/application';

export interface KaivuilmoitusFormValues extends Omit<Application<KaivuilmoitusData>, 'paatokset'> {
  geometriesChanged?: boolean; // virtualField
  selfIntersectingPolygon?: boolean; // virtualField
}
