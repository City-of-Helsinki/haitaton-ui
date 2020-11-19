import { PayloadAction, CaseReducer, createSlice } from '@reduxjs/toolkit';
import { saveForm } from './thunks';
import { HankeDataDraft } from './types';

type State = {
  hankeDataDraft: HankeDataDraft;
  status: string | null;
};

const updateFormData: CaseReducer<State, PayloadAction<HankeDataDraft>> = (state, action) => {
  state.hankeDataDraft = action.payload;
};

const initialState: State = {
  hankeDataDraft: {},
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
