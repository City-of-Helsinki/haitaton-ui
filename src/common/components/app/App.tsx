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

const queryClient = new QueryClient();

const App: React.FC<React.PropsWithChildren<unknown>> = () => (
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

export default App;
