import { useSelector, useDispatch } from 'react-redux';
import { getFilterStartDate, getFilterEndDate } from '../selectors';
import { actions } from '../reducer';
import { PortfolioFilters } from '../types';

export const usePortfolioFilter = () => {
  const dispatch = useDispatch();
  const hankeFilterStartDate = useSelector(getFilterStartDate());
  const hankeFilterEndDate = useSelector(getFilterEndDate());

  const setHankeFilterStartDate = (newHankeFilterStartDate: PortfolioFilters['endDate']) =>
    dispatch(actions.setFilterStartDate(newHankeFilterStartDate));

  const setHankeFilterEndDate = (newHankeFilterEndDate: PortfolioFilters['startDate']) =>
    dispatch(actions.setFilterEndDate(newHankeFilterEndDate));

  return {
    hankeFilterStartDate,
    hankeFilterEndDate,
    setHankeFilterEndDate,
    setHankeFilterStartDate,
  };
};
