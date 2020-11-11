import { useSelector, useDispatch } from 'react-redux';
import { getMapDataLayers, getStatus, getGeometry } from '../selectors';
import { actions } from '../reducer';
import { saveGeometryData } from '../thunks';
import { MapDataLayerKey } from '../types';
import { HankeGeoJSON } from '../../../common/types/hanke';

export const useMapDataLayers = () => {
  const dispatch = useDispatch();
  const dataLayers = useSelector(getMapDataLayers());
  const status = useSelector(getStatus());
  const drawGeometry = useSelector(getGeometry());

  const toggleDataLayer = (dataLayerKey: MapDataLayerKey) =>
    dispatch(actions.toggleLayer(dataLayerKey));

  const handleUpdateGeometryState = (geometryData: HankeGeoJSON) =>
    dispatch(actions.updateGeometry(geometryData));

  const handleSaveGeometry = async () => {
    if (!drawGeometry) return;
    try {
      await dispatch(
        saveGeometryData({
          hankeId: 'ABC123',
          data: drawGeometry,
        })
      );
    } catch (e) {
      // eslint-disable-next-line
      console.error(e.message);
    }
  };

  return {
    dataLayers,
    toggleDataLayer,
    handleSaveGeometry,
    handleUpdateGeometryState,
    status,
    dispatch,
  };
};
