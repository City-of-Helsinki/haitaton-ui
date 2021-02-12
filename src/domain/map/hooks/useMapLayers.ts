import { useSelector, useDispatch } from 'react-redux';
import { getMapTileLayers, getStatus } from '../selectors';
import { actions } from '../reducer';
import { MapTileLayerId } from '../types';
import { HankeGeoJSON } from '../../../common/types/hanke';

export const useMapDataLayers = () => {
  const dispatch = useDispatch();
  const mapTileLayers = useSelector(getMapTileLayers());
  const status = useSelector(getStatus());

  const toggleMapTileLayer = (mapTileLayerKey: MapTileLayerId) =>
    dispatch(actions.toggleMapTileLayer(mapTileLayerKey));

  const handleUpdateGeometryState = (geometryData: HankeGeoJSON) =>
    dispatch(actions.updateDrawGeometry(geometryData));

  return {
    mapTileLayers,
    toggleMapTileLayer,
    handleUpdateGeometryState,
    status,
  };
};
