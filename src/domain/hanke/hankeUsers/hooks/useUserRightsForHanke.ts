import { useQuery } from 'react-query';
import { SignedInUser, SignedInUserByHanke } from '../hankeUser';
import { getSignedInUserForHanke, getSignedInUserByHanke } from '../hankeUsersApi';

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
  return useQuery<SignedInUserByHanke>(['signedInUserByHanke'], () => getSignedInUserByHanke(), {
    enabled: true,
  });
}
