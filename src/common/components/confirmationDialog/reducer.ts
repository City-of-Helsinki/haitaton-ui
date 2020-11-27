import { PayloadAction, CaseReducer, createSlice } from '@reduxjs/toolkit';

type State = {
  isDialogOpen: boolean;
  redirectUrl: string;
};
type Props = { isDialogOpen: boolean; redirectUrl: string };

const updateIsDialogOpen: CaseReducer<State, PayloadAction<Props>> = (state, action) => {
  state.isDialogOpen = action.payload.isDialogOpen;
  state.redirectUrl = action.payload.redirectUrl;
};

const initialState: State = {
  isDialogOpen: false,
  redirectUrl: '/',
};

const formSlice = createSlice({
  name: 'confirmationDialog',
  initialState,
  reducers: {
    updateIsDialogOpen,
  },
});
export const { actions, caseReducers } = formSlice;

export default formSlice.reducer;
