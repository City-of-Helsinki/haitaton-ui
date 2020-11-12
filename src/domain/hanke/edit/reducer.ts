import { PayloadAction, CaseReducer, createSlice } from '@reduxjs/toolkit';
import { saveFormData } from './thunks';
import { HankeData } from './types';

type State = {
  hankeData: HankeData | null;
  status: string | null;
  requestStatus: any;
};

const updateFormData: CaseReducer<State, PayloadAction<any>> = (state, action) => {
  state.hankeData = action.payload;
  state.requestStatus = action.payload;
};

const initialState: State = {
  hankeData: null, // Null or write default HankeData
  status: null,
  requestStatus: null,
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
