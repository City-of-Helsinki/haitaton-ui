import { useFeatureFlags } from '../../../../common/components/featureFlags/FeatureFlagsContext';
import { ApplicationType } from '../../types/application';

export default function useIsInformationRequestFeatureEnabled(applicationType: ApplicationType) {
  const features = useFeatureFlags();
  // TODO: at the moment information request (täydennyspyyntö) feature can be enabled for CABLE_REPORT applications only
  return applicationType === 'CABLE_REPORT' && features.informationRequest;
}
