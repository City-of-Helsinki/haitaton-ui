import { useSelector, useDispatch } from 'react-redux';
import { getHankeFilterStartDate, getHankeFilterEndDate } from '../selectors';
import { actions } from '../reducer';
import { HankeFilters } from '../types';

export const useDateRangeFilter = () => {
  const dispatch = useDispatch();
  const hankeFilterStartDate = useSelector(getHankeFilterStartDate());
  const hankeFilterEndDate = useSelector(getHankeFilterEndDate());

  const setHankeFilterStartDate = (newHankeFilterStartDate: HankeFilters['endDate']) =>
    dispatch(actions.setHankeFilterStartDate(newHankeFilterStartDate));

  const setHankeFilterEndDate = (newHankeFilterEndDate: HankeFilters['startDate']) =>
    dispatch(actions.setHankeFilterEndDate(newHankeFilterEndDate));

  return {
    hankeFilterStartDate,
    hankeFilterEndDate,
    setHankeFilterEndDate,
    setHankeFilterStartDate,
  };
};
