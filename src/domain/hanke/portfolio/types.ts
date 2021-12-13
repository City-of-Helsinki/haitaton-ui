export type ReducerState = {
  portfolioFilters: PortfolioFilters;
};

export type PortfolioFilters = {
  startDate: string | null;
  endDate: string | null;
};
