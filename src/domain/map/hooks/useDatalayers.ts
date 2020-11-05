import { useSelector, useDispatch } from 'react-redux';
import { getMapDatalayers } from '../selectors';
import { actions } from '../reducer';
import { MapDatalayer } from '../types';

export const useDatalayers = () => {
  const dispatch = useDispatch();
  const datalayers = useSelector(getMapDatalayers());

  const toggleDatalayer = (id: MapDatalayer) => dispatch(actions.toggleLayer(id));

  return { datalayers, toggleDatalayer, dispatch };
};
