import React from 'react';
import { Provider } from 'react-redux';
import { QueryCache, ReactQueryCacheProvider } from 'react-query';
import { withRouter, Switch, Route } from 'react-router-dom';
import { ThemeProvider } from '@chakra-ui/core';
import OpenLayer from '../../../features/map/OpenLayer';
import HankeForm from '../../../features/hanke/form/Form';
import Layout from './Layout';
import Main from './Main';
import store from './store';
import theme from './theme';
import './app.scss';

const queryCache = new QueryCache();

const App: React.FC = () => (
  <Provider store={store}>
    <ReactQueryCacheProvider queryCache={queryCache}>
      <ThemeProvider theme={theme}>
        <Layout>
          <Switch>
            <Route exact path="/" render={() => <Main />} />
            <Route exact path="/openlayer" render={() => <OpenLayer />} />
            <Route exact path="/form" render={() => <HankeForm />} />
          </Switch>
        </Layout>
      </ThemeProvider>
    </ReactQueryCacheProvider>
  </Provider>
);

export default withRouter(App);
