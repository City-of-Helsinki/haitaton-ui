import React from 'react';
import { Provider } from 'react-redux';
import { QueryCache, ReactQueryCacheProvider } from 'react-query';
import { ChakraProvider } from '@chakra-ui/react';

import AppRoutes from '../../routes/AppRoutes';
import Layout from './Layout';
import { store } from '../../redux/store';
import theme from './theme';
import './app.scss';
import '../../../assets/styles/reset.css';

const queryCache = new QueryCache();

const App: React.FC = () => (
  <Provider store={store}>
    <ReactQueryCacheProvider queryCache={queryCache}>
      <ChakraProvider theme={theme}>
        <Layout>
          <AppRoutes />
        </Layout>
      </ChakraProvider>
    </ReactQueryCacheProvider>
  </Provider>
);

export default App;
