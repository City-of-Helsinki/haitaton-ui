import { PayloadAction, CaseReducer, createSlice } from '@reduxjs/toolkit';
import { ReducerState } from './types';

const setFilterStartDate: CaseReducer<ReducerState, PayloadAction<string | null>> = (
  state,
  action
) => {
  state.portfolioFilters.startDate = action.payload;
};

const setFilterEndDate: CaseReducer<ReducerState, PayloadAction<string | null>> = (
  state,
  action
) => {
  state.portfolioFilters.endDate = action.payload;
};

const initialState: ReducerState = {
  portfolioFilters: {
    startDate: null,
    endDate: null,
  },
};

const mapSlice = createSlice({
  name: 'hankePortfolio',
  initialState,
  reducers: {
    setFilterStartDate,
    setFilterEndDate,
  },
});

export const { actions, caseReducers } = mapSlice;

export default mapSlice.reducer;
