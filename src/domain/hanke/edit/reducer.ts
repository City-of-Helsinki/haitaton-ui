import { PayloadAction, CaseReducer, createSlice } from '@reduxjs/toolkit';
import { saveFormData } from './thunks';
import { HankeData } from './types';

type State = {
  hankeData: HankeData | null;
  status: string | null;
  hankeFormData: any;
};

const updateFormData: CaseReducer<State, PayloadAction<HankeData>> = (state, action) => {
  state.hankeData = action.payload;
  state.hankeFormData = action.payload;
};

const initialState: State = {
  hankeData: null, // Null or write default HankeData
  status: null,
  hankeFormData: null,
};

const formSlice = createSlice({
  name: 'hankeForm',
  initialState,
  reducers: {
    updateFormData,
  },
  extraReducers: (builder) => {
    builder.addCase(saveFormData.fulfilled, (state, { payload }) => {
      state.status = 'ok';
    });
    builder.addCase(saveFormData.rejected, (state, action) => {
      state.status = 'error';
    });
  },
});
export const { actions, caseReducers } = formSlice;

export default formSlice.reducer;
