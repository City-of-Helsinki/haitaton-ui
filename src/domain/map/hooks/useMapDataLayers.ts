import { useSelector, useDispatch } from 'react-redux';
import { getMapDataLayers, getStatus } from '../selectors';
import { actions, fetchIssuesCount } from '../reducer';
import { MapDataLayerKey } from '../types';

export const useMapDataLayers = () => {
  const dispatch = useDispatch();
  const dataLayers = useSelector(getMapDataLayers());
  const status = useSelector(getStatus());

  const toggleDataLayer = (dataLayerKey: MapDataLayerKey) =>
    dispatch(actions.toggleLayer(dataLayerKey));

  const handleFetch = () => dispatch(fetchIssuesCount('test', 'repo'));

  return { dataLayers, toggleDataLayer, handleFetch, status, dispatch };
};
