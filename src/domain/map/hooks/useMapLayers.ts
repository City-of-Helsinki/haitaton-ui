import { useSelector, useDispatch } from 'react-redux';
import { getMapDataLayers, getMapTileLayers, getStatus } from '../selectors';
import { actions } from '../reducer';
import { MapDataLayerKey, MapTileLayerId } from '../types';
import { HankeGeoJSON } from '../../../common/types/hanke';

export const useMapDataLayers = () => {
  const dispatch = useDispatch();
  const dataLayers = useSelector(getMapDataLayers());
  const mapTileLayers = useSelector(getMapTileLayers());
  const status = useSelector(getStatus());

  const toggleDataLayer = (dataLayerKey: MapDataLayerKey) =>
    dispatch(actions.toggleLayer(dataLayerKey));

  const toggleMapTileLayer = (mapTileLayerKey: MapTileLayerId) =>
    dispatch(actions.toggleMapTileLayer(mapTileLayerKey));

  const handleUpdateGeometryState = (geometryData: HankeGeoJSON) =>
    dispatch(actions.updateDrawGeometry(geometryData));

  return {
    dataLayers,
    mapTileLayers,
    toggleDataLayer,
    toggleMapTileLayer,
    handleUpdateGeometryState,
    status,
    dispatch,
  };
};
