import { PayloadAction, CaseReducer, createSlice } from '@reduxjs/toolkit';

import { HankeData } from './types';

type State = {
  hankeData: HankeData | null;
};

const updateFormData: CaseReducer<State, PayloadAction<HankeData>> = (state, action) => {
  state.hankeData = action.payload;
};

const initialState: State = {
  hankeData: null, // Null or write default HankeData
};

const projectsSlice = createSlice({
  name: 'hankeForm',
  initialState,
  reducers: {
    updateFormData,
  },
});

export const { actions } = projectsSlice;

export default projectsSlice.reducer;
