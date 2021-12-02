import { PayloadAction, CaseReducer, createSlice } from '@reduxjs/toolkit';
import { ReducerState } from './types';

const currentYear = new Date().getFullYear();

const setFilterStartDate: CaseReducer<ReducerState, PayloadAction<string>> = (state, action) => {
  state.portfolioFilters.startDate = action.payload;
};

const setFilterEndDate: CaseReducer<ReducerState, PayloadAction<string>> = (state, action) => {
  state.portfolioFilters.endDate = action.payload;
};

const initialState: ReducerState = {
  portfolioFilters: {
    startDate: `${currentYear}-01-01`,
    endDate: `${currentYear + 1}-12-31`,
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
