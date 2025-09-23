import { useMutation } from 'react-query';
import { Polygon } from 'ol/geom';
import api from '../../api/api';
import {
  HANKE_KAISTAHAITTA_KEY,
  HANKE_KAISTAPITUUSHAITTA_KEY,
  HankeGeometria,
} from '../../types/hanke';
import { HaittaIndexData } from '../../common/haittaIndexes/types';
import { isPolygonSelfIntersecting } from '../../../common/components/map/utils';

type HankeAlueData = {
  geometriat: HankeGeometria;
  haittaAlkuPvm: Date;
  haittaLoppuPvm: Date;
  kaistaHaitta: HANKE_KAISTAHAITTA_KEY;
  kaistaPituusHaitta: HANKE_KAISTAPITUUSHAITTA_KEY;
};

/**
 * Request haittaindeksit for hanke area
 */
async function calculateHaittaIndexes(data: HankeAlueData) {
  const polygonToCheck = new Polygon(
    data.geometriat.featureCollection.features[0].geometry.coordinates,
  );
  if (isPolygonSelfIntersecting(polygonToCheck)) {
    throw new Error('Self-intersecting polygon');
  }
  const { data: response } = await api.post<HaittaIndexData>('/haittaindeksit', data);
  return response;
}

export default function useHaittaIndexes() {
  return useMutation(calculateHaittaIndexes);
}
