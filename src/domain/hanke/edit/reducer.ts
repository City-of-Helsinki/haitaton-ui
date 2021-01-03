import { PayloadAction, CaseReducer, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
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

export const hankeDataDraft = {
  omistajat: [],
  toteuttajat: [],
  arvioijat: [],
};

export const initialState: State = {
  hankeDataDraft,
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
        toast.success('Tallennettii onnistuneesti');
      }
    });
    builder.addCase(saveForm.rejected, (state) => {
      state.status = 'error';
      toast.warn('Tallennus epäonnistui');
    });
  },
});
export const { actions, caseReducers } = formSlice;

export default formSlice.reducer;
