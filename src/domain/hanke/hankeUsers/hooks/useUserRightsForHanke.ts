import { useQuery } from 'react-query';
import { SignedInUser, SignedInUserByHanke } from '../hankeUser';
import { getSignedInUserForHanke, getSignedInUserByHanke } from '../hankeUsersApi';
import axios from 'axios';

export function usePermissionsForHanke(hankeTunnus?: string) {
  return useQuery<SignedInUser>(
    ['signedInUser', hankeTunnus],
    () => getSignedInUserForHanke(hankeTunnus),
    {
      enabled: Boolean(hankeTunnus),
      staleTime: 30000,
    },
  );
}

export function usePermissionsByHanke() {
  return useQuery<SignedInUserByHanke | null>(
    ['signedInUserByHanke'],
    async () => {
      try {
        return await getSignedInUserByHanke();
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          return null;
        }
        throw error;
      }
    },
    {
      enabled: true,
    },
  );
}
