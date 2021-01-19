import { useSelector, useDispatch } from 'react-redux';
import { getMapDataLayers, getStatus } from '../selectors';
import { actions } from '../reducer';
import { MapDataLayerKey } from '../types';
import { HankeGeoJSON } from '../../../common/types/hanke';

export const useMapDataLayers = () => {
  const dispatch = useDispatch();
  const dataLayers = useSelector(getMapDataLayers());
  const status = useSelector(getStatus());

  const toggleDataLayer = (dataLayerKey: MapDataLayerKey) =>
    dispatch(actions.toggleLayer(dataLayerKey));

  const handleUpdateGeometryState = (geometryData: HankeGeoJSON) =>
    dispatch(actions.updateDrawGeometry(geometryData));

  return {
    dataLayers,
    toggleDataLayer,
    handleUpdateGeometryState,
    status,
    dispatch,
  };
};
