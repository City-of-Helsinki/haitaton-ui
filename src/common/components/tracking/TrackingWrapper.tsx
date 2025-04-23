import React, { useEffect } from 'react';

type TrackingWrapperProps = {
  children: React.ReactNode;
  matomoEnabled: boolean;
};

export function TrackingWrapper({
  children,
  matomoEnabled,
}: Readonly<TrackingWrapperProps>): JSX.Element {
  useEffect(() => {
    if (matomoEnabled) {
      try {
        // eslint-disable-next-line no-underscore-dangle
        const _paq = (window._paq = window._paq || []);
        _paq.push(['trackPageView']);
      } catch (_) {
        // ignore
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
}
