import { useSelector, useDispatch } from 'react-redux';
import { getMapDatalayers } from '../selectors';

export const useDatalayers = () => {
  const dispatch = useDispatch();
  const datalayers = useSelector(getMapDatalayers());

  return { datalayers, dispatch };
};
