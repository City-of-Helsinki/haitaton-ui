import React, { createContext, useContext, ReactNode, useMemo } from 'react';

type FeatureFlagsProviderProps = {
  children: ReactNode;
};

export type FeatureFlagsContextProps = {
  publicHankkeet: boolean;
  hanke: boolean;
  cableReportPaperDecision: boolean;
  informationRequest: boolean;
};

const FeatureFlagsContext = createContext<FeatureFlagsContextProps | undefined>(undefined);

export function FeatureFlagsProvider({ children }: FeatureFlagsProviderProps) {
  const value: FeatureFlagsContextProps = useMemo(
    () => ({
      publicHankkeet: window._env_.REACT_APP_FEATURE_PUBLIC_HANKKEET === '1',
      hanke: window._env_.REACT_APP_FEATURE_HANKE === '1',
      cableReportPaperDecision: window._env_.REACT_APP_FEATURE_CABLE_REPORT_PAPER_DECISION === '1',
      informationRequest: window._env_.REACT_APP_FEATURE_INFORMATION_REQUEST === '1',
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
