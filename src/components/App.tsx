import React from 'react';
import { Provider } from 'react-redux';
import { QueryCache, ReactQueryCacheProvider } from 'react-query';
import { withRouter, Switch, Route } from 'react-router-dom';
import Layout from './Layout';
import Main from './Main';
import store from '../store';
import OpenLayer from './OpenLayer';
import FormComponent from './form/Form';

import './app.scss';

const queryCache = new QueryCache();

const App: React.FC = () => (
  <Provider store={store}>
    <ReactQueryCacheProvider queryCache={queryCache}>
      <Layout>
        <Switch>
          <Route exact path="/" render={() => <Main />} />
          <Route exact path="/openlayer" render={() => <OpenLayer />} />
          <Route exact path="/form" render={() => <FormComponent />} />
        </Switch>
      </Layout>
    </ReactQueryCacheProvider>
  </Provider>
);

export default withRouter(App);
