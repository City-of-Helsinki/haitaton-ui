import { useSelector, useDispatch } from 'react-redux';
import { getMapDataLayers } from '../selectors';
import { actions } from '../reducer';
import { MapDataLayerKey } from '../types';

export const useMapDataLayers = () => {
  const dispatch = useDispatch();
  const dataLayers = useSelector(getMapDataLayers());

  const toggleDataLayer = (dataLayerKey: MapDataLayerKey) =>
    dispatch(actions.toggleLayer(dataLayerKey));

  return { dataLayers, toggleDataLayer, dispatch };
};
