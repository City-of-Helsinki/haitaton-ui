import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ChakraProvider } from '@chakra-ui/react';
import { CookieBanner, CookieConsentContextProvider, LoginProvider } from 'hds-react';
import AppRoutes from '../../routes/AppRoutes';
import Layout from './Layout';
import { store } from '../../redux/store';
import theme from './theme';
import { GlobalNotificationProvider } from '../globalNotification/GlobalNotificationContext';
import GlobalNotification from '../globalNotification/GlobalNotification';
import { FeatureFlagsProvider } from '../featureFlags/FeatureFlagsContext';
import ScrollToTop from '../scrollToTop/ScrollToTop';
import './app.scss';
import '../../../assets/styles/reset.css';
import '../../../assets/styles/variables.css';
import MaintenancePage from '../../../pages/staticPages/MaintenancePage';
import AccessibleNavigationAnnouncer from '../NavigationAnnouncer';
import { loginProviderProps } from '../../../domain/auth/loginProviderProps';
import siteSettings from './sitesettings.json';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { TrackingWrapper } from '../tracking/TrackingWrapper';
import { ExternalScripts } from '../externalScripts/ExternalScripts';

const queryClient = new QueryClient();

/// check if the user has accepted the statistics cookies
/// the HDS version of this hook (useGroupConsent('statistics') or useCookienConsents()) doesn't work
function hasUserAcceptedStatistics(): boolean {
  const cookies = document.cookie.split(';').map((cookie) => cookie.trim());
  const consentCookie = cookies.find((cookie) => cookie.startsWith('haitaton-cookie-consents='));
  if (consentCookie) {
    const val = consentCookie.split('=')[1];
    if (val == null) {
      return false;
    }
    const des = decodeURIComponent(val);
    const parsed = JSON.parse(des);
    if (parsed) {
      return parsed.groups['statistics'] != null;
    }
  }
  return false;
}

// hook wrap so we can recheck the cookie as a side effect
function useHasUserAcceptedStatistics() {
  const [analyticsAccepted, setAnalyticsAccepted] = useState(false);
  useEffect(() => {
    setAnalyticsAccepted(hasUserAcceptedStatistics());
  }, [setAnalyticsAccepted]);
  return {
    hasUserAcceptedStatistics: analyticsAccepted,
    recheck: () => setAnalyticsAccepted(hasUserAcceptedStatistics()),
  };
}

function App({ matomoEnabled }: Readonly<{ matomoEnabled: boolean }>) {
  const { i18n } = useTranslation();
  const { hasUserAcceptedStatistics: statisticsAccepted, recheck } = useHasUserAcceptedStatistics();
  const language = i18n.language;
  const enableMatomo = matomoEnabled && statisticsAccepted;

  // If there is a maintenance text defined in the environment variables,
  // render the maintenance page instead of the normal app
  const maintenance = Boolean(window._env_.REACT_APP_MAINTENANCE_TEXT_FI);
  if (maintenance) {
    return <MaintenancePage />;
  }

  return (
    <CookieConsentContextProvider
      siteSettings={siteSettings}
      options={{ language }}
      onChange={recheck}
    >
      <TrackingWrapper matomoEnabled={enableMatomo}>
        <Provider store={store}>
          <LoginProvider {...loginProviderProps}>
            <QueryClientProvider client={queryClient}>
              <ChakraProvider theme={theme}>
                <FeatureFlagsProvider>
                  <Router>
                    <ScrollToTop />
                    <AccessibleNavigationAnnouncer />
                    <Layout>
                      <GlobalNotificationProvider>
                        <AppRoutes />
                        <GlobalNotification />
                        <CookieBanner />
                      </GlobalNotificationProvider>
                    </Layout>
                  </Router>
                </FeatureFlagsProvider>
              </ChakraProvider>
            </QueryClientProvider>
          </LoginProvider>
        </Provider>
      </TrackingWrapper>
      <ExternalScripts enableMatomo={enableMatomo} />
    </CookieConsentContextProvider>
  );
}

export default App;
