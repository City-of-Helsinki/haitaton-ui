import React, { createContext, useContext, ReactNode, useMemo } from 'react';

type FeatureFlagsProviderProps = {
  children: ReactNode;
};

export type FeatureFlagsContextProps = {
  publicHankkeet: boolean;
  hanke: boolean;
  accessRights: boolean;
};

const FeatureFlagsContext = createContext<FeatureFlagsContextProps | undefined>(undefined);

export function FeatureFlagsProvider({ children }: FeatureFlagsProviderProps) {
  const value: FeatureFlagsContextProps = useMemo(
    () => ({
      publicHankkeet: window._env_.REACT_APP_FEATURE_PUBLIC_HANKKEET === '1',
      hanke: window._env_.REACT_APP_FEATURE_HANKE === '1',
      accessRights: window._env_.REACT_APP_FEATURE_ACCESS_RIGHTS === '1',
    }),
    [],
  );

  return <FeatureFlagsContext.Provider value={value}>{children}</FeatureFlagsContext.Provider>;
}

export function useFeatureFlags(): FeatureFlagsContextProps {
  const context = useContext(FeatureFlagsContext);

  if (context === undefined) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagsProvider');
  }

  return context;
}
