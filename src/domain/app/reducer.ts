import { PayloadAction, CaseReducer, createSlice } from '@reduxjs/toolkit';

type State = {
  isLoading: boolean;
};
const updateIsLoading: CaseReducer<State, PayloadAction<boolean>> = (state, action) => {
  state.isLoading = action.payload;
};

const initialState: State = {
  isLoading: false,
};

const isLoadingSlice = createSlice({
  name: 'isLoading',
  initialState,
  reducers: {
    updateIsLoading,
  },
});
export const { actions, caseReducers } = isLoadingSlice;

export default isLoadingSlice.reducer;
