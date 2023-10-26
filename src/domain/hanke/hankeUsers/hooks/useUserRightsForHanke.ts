import { useQuery } from 'react-query';
import { SignedInUser } from '../hankeUser';
import { getSignedInUserForHanke } from '../hankeUsersApi';
import { useFeatureFlags } from '../../../../common/components/featureFlags/FeatureFlagsContext';

export default function useSignedInUserRightsForHanke(hankeTunnus?: string) {
  const features = useFeatureFlags();

  return useQuery<SignedInUser>(
    ['signedInUser', hankeTunnus],
    () => getSignedInUserForHanke(hankeTunnus),
    {
      enabled: Boolean(hankeTunnus) && features.accessRights,
    },
  );
}
