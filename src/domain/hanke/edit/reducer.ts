import { PayloadAction, CaseReducer, createSlice } from '@reduxjs/toolkit';
import { saveForm } from './thunks';
import { HankeDataDraft } from './types';

type State = {
  hankeDataDraft: HankeDataDraft;
  hasFormChanged: boolean;
  status: string | null;
  showNotification: string | null;
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
  showNotification: null,
};
const formSlice = createSlice({
  name: 'hankeForm',
  initialState,
  reducers: {
    updateFormData,
    updateHasFormChanged,
  },
  /*
  extraReducers: {
    [saveForm.pending]: (state, action) => {
      state.status = 'loading';
    },
    [saveForm.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      // Add any fetched posts to the array
      state.posts = state.posts.concat(action.payload);
    },
    [saveForm.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    },
  },
*/
  extraReducers: (builder) => {
    builder.addCase(saveForm.pending, (state) => {
      state.showNotification = null;
    });
    builder.addCase(saveForm.fulfilled, (state, { payload }) => {
      if (payload) {
        state.status = 'ok';
        state.hankeDataDraft = payload;
        state.showNotification = 'success';
      }
    });
    builder.addCase(saveForm.rejected, (state) => {
      state.status = 'error';
      state.showNotification = 'error';
    });
  },
});
export const { actions, caseReducers } = formSlice;

export default formSlice.reducer;
