import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ChakraProvider } from '@chakra-ui/react';
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
import MaintenancePage from '../../../pages/staticPages/MaintenancePage';

const queryClient = new QueryClient();

function App() {
  // If there is a maintenance text defined in the environment variables,
  // render the maintenance page instead of the normal app
  const maintenance = Boolean(window._env_.REACT_APP_MAINTENANCE_TEXT_FI);
  if (maintenance) {
    return <MaintenancePage />;
  }

  return (
    <Router>
      <ScrollToTop />
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <ChakraProvider theme={theme}>
            <FeatureFlagsProvider>
              <Layout>
                <GlobalNotificationProvider>
                  <AppRoutes />
                  <GlobalNotification />
                </GlobalNotificationProvider>
              </Layout>
            </FeatureFlagsProvider>
          </ChakraProvider>
        </QueryClientProvider>
      </Provider>
    </Router>
  );
}

export default App;
