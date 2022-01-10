import { PayloadAction, CaseReducer, createSlice } from '@reduxjs/toolkit';
import { saveForm } from './thunks';
import { HankeDataFormState, FormNotification } from './types';

type State = {
  hankeDataDraft: HankeDataFormState;
  hasFormChanged: boolean;
  showNotification: FormNotification;
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
    });
    builder.addCase(saveForm.fulfilled, (state, { payload }) => {
      if (payload) {
        state.hankeDataDraft = payload;
        state.showNotification = 'success';
      }
    });
    builder.addCase(saveForm.rejected, (state) => {
      state.showNotification = 'error';
    });
  },
});
export const { actions, caseReducers } = formSlice;

export default formSlice.reducer;
