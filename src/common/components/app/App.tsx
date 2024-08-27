import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ChakraProvider } from '@chakra-ui/react';
import { LoginProvider } from 'hds-react';
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

const queryClient = new QueryClient();

function App() {
  // If there is a maintenance text defined in the environment variables,
  // render the maintenance page instead of the normal app
  const maintenance = Boolean(window._env_.REACT_APP_MAINTENANCE_TEXT_FI);
  if (maintenance) {
    return <MaintenancePage />;
  }

  return (
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
                  </GlobalNotificationProvider>
                </Layout>
              </Router>
            </FeatureFlagsProvider>
          </ChakraProvider>
        </QueryClientProvider>
      </LoginProvider>
    </Provider>
  );
}

export default App;
