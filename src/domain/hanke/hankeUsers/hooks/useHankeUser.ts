import { useQuery } from 'react-query';
import { HankeUser } from '../hankeUser';
import { getUser } from '../hankeUsersApi';

export function useHankeUser(id?: string) {
  return useQuery<HankeUser>(['hankeUser', id], () => getUser(id), {
    enabled: Boolean(id),
    staleTime: 30000,
  });
}
