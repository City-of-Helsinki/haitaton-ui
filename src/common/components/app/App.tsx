import React from 'react';
import { Provider } from 'react-redux';
import { QueryCache, ReactQueryCacheProvider } from 'react-query';
import { withRouter } from 'react-router-dom';
import { ThemeProvider } from '@chakra-ui/core';
import AppRoutes from '../../routes/AppRoutes';
import Layout from './Layout';
import store from './store';
import theme from './theme';
import './app.scss';
import './layout.scss';

const queryCache = new QueryCache();

const App: React.FC = () => (
  <Provider store={store}>
    <ReactQueryCacheProvider queryCache={queryCache}>
      <ThemeProvider theme={theme}>
        <Layout>
          <AppRoutes />
        </Layout>
      </ThemeProvider>
    </ReactQueryCacheProvider>
  </Provider>
);

export default withRouter(App);
