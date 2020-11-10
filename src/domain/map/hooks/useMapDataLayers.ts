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
  const geometryData = useSelector(getGeometry());

  const toggleDataLayer = (dataLayerKey: MapDataLayerKey) =>
    dispatch(actions.toggleLayer(dataLayerKey));

  const handleUpdateGeometryState = (geojson: HankeGeoJSON) =>
    dispatch(actions.updateGeometry(geojson));

  const handleSaveGeometry = async () => {
    if (geometryData) {
      const resultAction = await dispatch(
        saveGeometryData({
          hankeId: '1',
          geometryData,
        })
      );
      console.log({ resultAction });
    } else {
      console.error('');
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
