import { useQuery } from 'react-query';
import { DeleteInfo } from '../hankeUser';
import { getUserDeleteInfo } from '../hankeUsersApi';

export function useDeleteInfo(id?: string | null) {
  return useQuery<DeleteInfo>(['deleteInfo', id], () => getUserDeleteInfo(id), {
    enabled: Boolean(id),
  });
}
