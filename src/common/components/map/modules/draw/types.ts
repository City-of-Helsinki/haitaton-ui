export enum ACTION {
  SELECT_FEATURE = 'selectFeature',
  SELECT_DRAW_TOOL = 'selectDrawTool',
}

export enum DRAWTOOLTYPE {
  POLYGON = 'Polygon',
  SQUARE = 'Square',
}

export type SelectedDrawToolType = DRAWTOOLTYPE | null;

export type State = {
  selectedFeature: unknown;
  selectedDrawtoolType: SelectedDrawToolType;
};

export type Action =
  | { type: ACTION.SELECT_FEATURE; id: string }
  | { type: ACTION.SELECT_DRAW_TOOL; drawToolType: SelectedDrawToolType };

export type Actions = {
  setSelectedDrawToolType: (val: SelectedDrawToolType) => void;
};

export type DrawContextType = {
  state: State | null;
  actions: Actions | null;
};
