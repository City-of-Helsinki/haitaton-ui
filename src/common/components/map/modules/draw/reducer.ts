import { State, Action, ACTION } from './types';

export const initialState: State = { selectedFeature: null, selectedDrawtoolType: null };

export function reducer(state: State, action: Action) {
  switch (action.type) {
    case ACTION.SELECT_DRAW_TOOL: {
      return { ...state, selectedDrawtoolType: action.drawToolType };
    }
    case ACTION.SELECT_FEATURE: {
      return { ...state, selectFeature: action.id };
    }
    default:
      throw new Error();
  }
}
