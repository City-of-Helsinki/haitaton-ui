import { useQuery } from 'react-query';
import { HankeUser } from '../hankeUser';
import { getHankeUsers } from '../hankeUsersApi';

export function useHankeUsers(hankeTunnus?: string | null) {
  return useQuery<HankeUser[]>(['hankeUsers', hankeTunnus], () => getHankeUsers(hankeTunnus), {
    enabled: Boolean(hankeTunnus),
  });
}
