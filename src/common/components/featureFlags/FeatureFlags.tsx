import React from 'react';
import { FeatureFlagsContextProps, useFeatureFlags } from './FeatureFlagsContext';

type Props = {
  flags: Array<keyof FeatureFlagsContextProps>;
  children: React.ReactNode;
};

function FeatureFlags({ flags, children }: Props) {
  const featureFlags = useFeatureFlags();

  const enabled: boolean = flags.every((flag) => featureFlags[flag] === true);

  if (!enabled) {
    return null;
  }

  return <>{children}</>;
}

export default FeatureFlags;
