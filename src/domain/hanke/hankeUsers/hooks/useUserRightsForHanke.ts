import { useQuery } from 'react-query';
import { SignedInUser, SignedInUserByHanke } from '../hankeUser';
import { getSignedInUserForHanke, getSignedInUserByHanke } from '../hankeUsersApi';
import { useFeatureFlags } from '../../../../common/components/featureFlags/FeatureFlagsContext';

export function usePermissionsForHanke(hankeTunnus?: string) {
  const features = useFeatureFlags();

  return useQuery<SignedInUser>(
    ['signedInUser', hankeTunnus],
    () => getSignedInUserForHanke(hankeTunnus),
    {
      enabled: Boolean(hankeTunnus) && features.accessRights,
      staleTime: 30000,
    },
  );
}

export function usePermissionsByHanke() {
  const features = useFeatureFlags();

  return useQuery<SignedInUserByHanke>(['signedInUserByHanke'], () => getSignedInUserByHanke(), {
    enabled: features.accessRights,
  });
}
