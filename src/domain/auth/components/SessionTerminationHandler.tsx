import { useEffect } from 'react';
import { useOidcClient } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { setLogoutHandler } from '../../api/api';
import { useGlobalNotification } from '../../../common/components/globalNotification/GlobalNotificationContext';

/**
 * Component that sets up automatic logout handling for session termination errors.
 * Must be rendered inside LoginProvider to access the OIDC client.
 */
export default function SessionTerminationHandler() {
  const oidcClient = useOidcClient();
  const { setNotification } = useGlobalNotification();
  const { t } = useTranslation();

  useEffect(() => {
    // Set up the logout handler that the API interceptor can use
    const handleLogout = () => {
      if (oidcClient) {
        // Show notification to user before logout
        setNotification(true, {
          message: t('authentication:sessionTerminated'),
          type: 'info',
          autoClose: true,
          autoCloseDuration: 5000,
          dismissible: false,
        });

        // Give user time to read the notification before logout
        setTimeout(() => {
          oidcClient.logout();
        }, 4000);
      }
    };

    setLogoutHandler(handleLogout);

    // Cleanup on unmount
    return () => {
      setLogoutHandler(null);
    };
  }, [oidcClient, setNotification, t]);

  // This component doesn't render anything
  return null;
}
