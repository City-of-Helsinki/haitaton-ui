import { State, Action, ACTION } from './types';

export const initialState: State = { selectedFeature: null, selectedDrawtoolType: null };

export function reducer(state: State, action: Action) {
  switch (action.type) {
    case ACTION.SELECT_DRAW_TOOL: {
      return { ...state, selectedDrawtoolType: action.selectedDrawtoolType };
    }
    case ACTION.SELECT_FEATURE: {
      return { ...state, selectedFeature: action.selectedFeature };
    }
    default:
      throw new Error();
  }
}
