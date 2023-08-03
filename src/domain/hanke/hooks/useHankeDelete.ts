import { useMutation } from 'react-query';
import api from '../../api/api';
import { HankeData } from '../../types/hanke';

function deleteHanke(hankeTunnus: string) {
  return api.delete<HankeData>(`/hankkeet/${hankeTunnus}`);
}

export default function useHankeDelete() {
  return useMutation(deleteHanke);
}
