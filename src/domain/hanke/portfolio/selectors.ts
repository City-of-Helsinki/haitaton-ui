import { RootState } from '../../../common/redux/store';

export const getFilterStartDate = () => (state: RootState) =>
  state.hankePortfolio.portfolioFilters.startDate;

export const getFilterEndDate = () => (state: RootState) =>
  state.hankePortfolio.portfolioFilters.endDate;
