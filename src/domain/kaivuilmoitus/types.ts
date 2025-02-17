import { Application, KaivuilmoitusData } from '../application/types/application';

export interface KaivuilmoitusFormValues
  extends Omit<Application<KaivuilmoitusData>, 'paatokset' | 'muutosilmoitus'> {
  geometriesChanged?: boolean; // virtualField
  selfIntersectingPolygon?: boolean; // virtualField
}
