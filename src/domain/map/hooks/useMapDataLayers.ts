import { useSelector, useDispatch } from 'react-redux';
import { getMapDataLayers, getStatus } from '../selectors';
import { actions } from '../reducer';
import { saveGeometryData } from '../thunks';
import { MapDataLayerKey } from '../types';

export const useMapDataLayers = () => {
  const dispatch = useDispatch();
  const dataLayers = useSelector(getMapDataLayers());
  const status = useSelector(getStatus());

  const toggleDataLayer = (dataLayerKey: MapDataLayerKey) =>
    dispatch(actions.toggleLayer(dataLayerKey));

  const handleSaveGeometry = async () => {
    const resultAction = await dispatch(
      saveGeometryData({
        hankeId: '1',
        geometryData: '',
      })
    );
    console.log({ resultAction });
    /* if (saveGeometryData.fulfilled.match(resultAction)) {
      const user = unwrapResult(resultAction);
    } else {
      console.log('error');
    } */
  };
  return { dataLayers, toggleDataLayer, handleSaveGeometry, status, dispatch };
};
