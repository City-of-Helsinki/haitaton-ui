import { PayloadAction, CaseReducer, createSlice } from '@reduxjs/toolkit';
import { saveForm } from './thunks';
import { HankeDataDraft } from './types';

type State = {
  hankeDataDraft: HankeDataDraft;
  hasFormChanged: boolean;
  status: string | null;
};

const updateFormData: CaseReducer<State, PayloadAction<HankeDataDraft>> = (state, action) => {
  state.hankeDataDraft = action.payload;
};
const updateHasFormChanged: CaseReducer<State, PayloadAction<boolean>> = (state, action) => {
  state.hasFormChanged = action.payload;
};

export const hankeDataDraftVal = {
  omistajat: [],
  toteuttajat: [],
  arvioijat: [],
};

export const initialState: State = {
  hankeDataDraft: hankeDataDraftVal,
  hasFormChanged: false,
  status: null,
};

const formSlice = createSlice({
  name: 'hankeForm',
  initialState,
  reducers: {
    updateFormData,
    updateHasFormChanged,
  },
  extraReducers: (builder) => {
    builder.addCase(saveForm.fulfilled, (state, { payload }) => {
      if (payload) {
        state.status = 'ok';
        state.hankeDataDraft = payload;
      }
    });
    builder.addCase(saveForm.rejected, (state, action) => {
      state.status = 'error';
    });
  },
});
export const { actions, caseReducers } = formSlice;

export default formSlice.reducer;
