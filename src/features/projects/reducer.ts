import { PayloadAction, CaseReducer, createSlice } from '@reduxjs/toolkit';

type State = number;

const increment: CaseReducer<State, PayloadAction<number>> = (state, action) =>
  state + action.payload;

const projectsSlice = createSlice({
  name: 'test',
  initialState: 0,
  reducers: {
    increment,
  },
});

export const { actions } = projectsSlice;

export default projectsSlice.reducer;

export const getProjects = (state: { projects: State }): number => state.projects;
