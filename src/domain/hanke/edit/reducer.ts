import { PayloadAction, CaseReducer, createSlice } from '@reduxjs/toolkit';
import { saveForm } from './thunks';
import { HankeData } from './types';

type State = {
  hankeData: HankeData | null;
  status: string | null;
};

const updateFormData: CaseReducer<State, PayloadAction<HankeData>> = (state, action) => {
  state.hankeData = action.payload;
};

const initialState: State = {
  hankeData: null, // Null or write default HankeData
  status: null,
};

const formSlice = createSlice({
  name: 'hankeForm',
  initialState,
  reducers: {
    updateFormData,
  },
  extraReducers: (builder) => {
    builder.addCase(saveForm.fulfilled, (state, { payload }) => {
      state.status = 'ok';
    });
    builder.addCase(saveForm.rejected, (state, action) => {
      state.status = 'error';
    });
  },
});
export const { actions, caseReducers } = formSlice;

export default formSlice.reducer;
