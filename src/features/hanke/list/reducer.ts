import { PayloadAction, CaseReducer, createSlice } from '@reduxjs/toolkit';

type State = number;

const increment: CaseReducer<State, PayloadAction<number>> = (state, action) =>
  state + action.payload;

const projectsSlice = createSlice({
  name: 'projects',
  initialState: 0,
  reducers: {
    increment,
  },
});

export const { actions } = projectsSlice;

export default projectsSlice.reducer;
