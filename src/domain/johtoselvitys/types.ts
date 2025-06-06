import { Feature } from 'ol';
import Geometry from 'ol/geom/Geometry';
import { Application, ApplicationArea, JohtoselvitysData } from '../application/types/application';

export interface JohtoselvitysArea extends ApplicationArea {
  feature?: Feature<Geometry>;
}

export interface JohtoselvitysFormData extends JohtoselvitysData {
  areas: JohtoselvitysArea[];
}

export interface JohtoselvitysFormValues extends Omit<Application<JohtoselvitysData>, 'paatokset'> {
  applicationData: JohtoselvitysFormData;
  geometriesChanged?: boolean; // virtualField
  selfIntersectingPolygon?: boolean; // virtualField
}
