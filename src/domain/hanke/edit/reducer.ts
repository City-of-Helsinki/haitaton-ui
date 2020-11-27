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
const emptyContact = {
  id: null,
  sukunimi: '',
  etunimi: '',
  email: '',
  puhelinnumero: '',
  organisaatioId: null,
  organisaatioNimi: '',
  osasto: '',
};

const initialState: State = {
  hankeDataDraft: {
    omistajat: [emptyContact],
    toteuttajat: [emptyContact],
    arvioijat: [emptyContact],
  },
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
      state.status = 'ok';
    });
    builder.addCase(saveForm.rejected, (state, action) => {
      state.status = 'error';
    });
  },
});
export const { actions, caseReducers } = formSlice;

export default formSlice.reducer;
