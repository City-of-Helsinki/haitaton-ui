import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ChakraProvider } from '@chakra-ui/react';
import AppRoutes from '../../routes/AppRoutes';
import Layout from './Layout';
import { store } from '../../redux/store';
// import theme from './theme';
import './app.scss';
import '../../../assets/styles/reset.css';

const queryClient = new QueryClient();

const App: React.FC = () => (
  <Router>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider>
          <Layout>
            <AppRoutes />
          </Layout>
        </ChakraProvider>
      </QueryClientProvider>
    </Provider>
  </Router>
);

export default App;
