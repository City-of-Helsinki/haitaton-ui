import { PayloadAction, CaseReducer, createSlice } from '@reduxjs/toolkit';
// eslint-disable-next-line
type State = any;

const formData: CaseReducer<State, PayloadAction<number>> = (state, action) => action.payload;

const projectsSlice = createSlice({
  name: 'projects',
  initialState: {},
  reducers: {
    formData,
  },
});

export const { actions } = projectsSlice;

export default projectsSlice.reducer;
