import { Feature } from 'ol';
import Geometry from 'ol/geom/Geometry';
import { Application, ApplicationArea, KaivuilmoitusData } from '../application/types/application';

export interface KaivuilmoitusArea extends ApplicationArea {
  feature?: Feature<Geometry>;
}

export interface KaivuilmoitusFormData extends KaivuilmoitusData {
  areas: KaivuilmoitusArea[];
}

export interface KaivuilmoitusFormValues extends Application<KaivuilmoitusData> {
  applicationData: KaivuilmoitusFormData;
  geometriesChanged?: boolean; // virtualField
  selfIntersectingPolygon?: boolean; // virtualField
}
