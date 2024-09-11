import { useMutation } from 'react-query';
import api from '../../api/api';
import {
  HANKE_KAISTAHAITTA_KEY,
  HANKE_KAISTAPITUUSHAITTA_KEY,
  HankeGeometria,
} from '../../types/hanke';
import { HaittaIndexData } from '../../common/haittaIndexes/types';
import { calculateLiikennehaittaindeksienYhteenveto } from '../../map/utils';

type TormaystarkasteluRequest = {
  geometriat: HankeGeometria;
  haittaAlkuPvm: Date;
  haittaLoppuPvm: Date;
  kaistaHaitta: HANKE_KAISTAHAITTA_KEY;
  kaistaPituusHaitta: HANKE_KAISTAPITUUSHAITTA_KEY;
};

/**
 * Request haittaindeksit for an area
 */
async function calculateHaittaindeksit(data: TormaystarkasteluRequest) {
  const { data: response } = await api.post<HaittaIndexData>('/haittaindeksit', data);
  return response;
}

/**
 * Request haittaindeksit for multiple areas and calculate summary for them
 */
async function calculateHaittaindeksityhteenveto(data: TormaystarkasteluRequest[]) {
  const haittaindeksit = await Promise.all(
    data.map(async (d) => {
      const { data: response } = await api.post<HaittaIndexData>('/haittaindeksit', d);
      return response;
    }),
  );
  return calculateLiikennehaittaindeksienYhteenveto(haittaindeksit);
}

export default function useHaittaIndexes() {
  return useMutation(calculateHaittaindeksit);
}

export function useHaittaIndexSummary() {
  return useMutation(calculateHaittaindeksityhteenveto);
}
