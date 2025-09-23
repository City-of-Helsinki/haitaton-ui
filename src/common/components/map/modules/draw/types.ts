import Feature from 'ol/Feature';
import { Vector as VectorSource } from 'ol/source';
import { Map } from 'ol';
import { Coordinate } from 'ol/coordinate';

export enum ACTION {
  SELECT_FEATURE = 'selectFeature',
  SELECT_DRAW_TOOL = 'selectDrawTool',
}

export enum DRAWTOOLTYPE {
  SQUARE = 'Square',
  POLYGON = 'Polygon',
}

export type SelectedDrawToolType = DRAWTOOLTYPE | null;
export type SelectedFeature = Feature | null;
export type DrawSegmentGuard = (map: Map, latestLine: [Coordinate, Coordinate]) => boolean;

export type State = {
  selectedFeature: SelectedFeature;
  selectedDrawtoolType: SelectedDrawToolType;
};

export type Action =
  | { type: ACTION.SELECT_FEATURE; selectedFeature: SelectedFeature }
  | { type: ACTION.SELECT_DRAW_TOOL; selectedDrawtoolType: SelectedDrawToolType };

export type Actions = {
  setSelectedFeature: (selectedFeature: SelectedFeature) => void;
  setSelectedDrawToolType: (selectedDrawtoolType: SelectedDrawToolType) => void;
};

export type DrawContextType = {
  state: State;
  source: VectorSource;
  actions: Actions;
};
