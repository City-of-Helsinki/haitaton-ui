import { PayloadAction, CaseReducer, createSlice } from '@reduxjs/toolkit';
import { saveForm } from './thunks';
import { HankeDataFormState, FormNotification } from './types';

type State = {
  hankeDataDraft: HankeDataFormState;
  hasFormChanged: boolean;
  showNotification: FormNotification;
  isSaving: boolean;
};

const updateFormData: CaseReducer<State, PayloadAction<HankeDataFormState>> = (state, action) => {
  state.hankeDataDraft = action.payload;
  state.showNotification = null;
};
const updateHasFormChanged: CaseReducer<State, PayloadAction<boolean>> = (state, action) => {
  state.hasFormChanged = action.payload;
};

export const hankeDataDraft = {
  omistajat: [],
  toteuttajat: [],
  arvioijat: [],
  geometriesChanged: false,
};

export const initialState: State = {
  hankeDataDraft,
  hasFormChanged: false,
  showNotification: null,
  isSaving: false,
};
const formSlice = createSlice({
  name: 'hankeForm',
  initialState,
  reducers: {
    updateFormData,
    updateHasFormChanged,
  },
  extraReducers: (builder) => {
    builder.addCase(saveForm.pending, (state) => {
      state.showNotification = null;
      state.isSaving = true;
    });
    builder.addCase(saveForm.fulfilled, (state, { payload }) => {
      if (payload) {
        state.hankeDataDraft = payload;
        state.showNotification = 'success';
        state.isSaving = false;
      }
    });
    builder.addCase(saveForm.rejected, (state) => {
      state.showNotification = 'error';
      state.isSaving = false;
    });
  },
});
export const { actions, caseReducers } = formSlice;

export default formSlice.reducer;
