import React, { useEffect } from 'react';

type Props = {
  enableMatomo: boolean;
};

function MatomoScript(): JSX.Element | null {
  useEffect(() => {
    // Create and configure the script element
    const script = document.createElement('script');
    script.src = '/scripts/init-matomo.js';
    script.async = true;
    script.id = 'matomo';
    document.body.appendChild(script);

    // Clean up by removing the script when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // This component does not render anything visible
  return null;
}

export function ExternalScripts({ enableMatomo }: Props): JSX.Element | null {
  if (!enableMatomo) {
    return null;
  }

  return <MatomoScript />;
}
