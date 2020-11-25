import { PayloadAction, CaseReducer, createSlice } from '@reduxjs/toolkit';
import { saveForm } from './thunks';
import { HankeDataDraft } from './types';

type State = {
  hankeDataDraft: HankeDataDraft;
  hasFormChanged: boolean;
  isConfirmationDialogOpen: boolean;
  status: string | null;
};

const updateFormData: CaseReducer<State, PayloadAction<HankeDataDraft>> = (state, action) => {
  state.hankeDataDraft = action.payload;
};
const updateHasFormChanged: CaseReducer<State, PayloadAction<boolean>> = (state, action) => {
  state.hasFormChanged = action.payload;
};
const updateIsConfirmationDialogOpen: CaseReducer<State, PayloadAction<boolean>> = (
  state,
  action
) => {
  state.isConfirmationDialogOpen = action.payload;
};

const initialState: State = {
  hankeDataDraft: {},
  hasFormChanged: false,
  isConfirmationDialogOpen: false,
  status: null,
};

const formSlice = createSlice({
  name: 'hankeForm',
  initialState,
  reducers: {
    updateFormData,
    updateHasFormChanged,
    updateIsConfirmationDialogOpen,
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
