import { useFeatureFlags } from '../../../../common/components/featureFlags/FeatureFlagsContext';

export default function useIsInformationRequestFeatureEnabled() {
  const features = useFeatureFlags();
  return features.informationRequest;
}
