import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { addGraphQLSubscriptions } from 'add-graphql-subscriptions';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';

// import { start, done } from './apollo/middleware/nprogress';
import { urls } from '../helpers';
import errorAfterware from './apollo/middleware/error';

const networkInterface = createNetworkInterface({ uri: urls.api.concat('/graphql') });

networkInterface.use([
  {
    applyMiddleware({ options }, next) {
      try {
        options.credentials = 'include';
        options.headers = options.headers || {};
      } catch (e) {
        console.error(e);
      }
      next();
    }
  }
]);

const fetch = {
  applyMiddleware(middlewares) {
    networkInterface.use(
      middlewares.map(middleware => ({
        applyMiddleware: ({ request, options }, next) => {
          const retval = middleware(request, options, client);
          if (retval instanceof Promise) {
            retval.then(next);
          } else {
            next();
          }
        }
      }))
    );
    return this;
  },

  applyAfterware(afterwares) {
    networkInterface.useAfter(
      afterwares.map(afterware => ({
        applyAfterware: ({ response, options }, next) => {
          const retval = afterware(response, options, client);
          if (retval instanceof Promise) {
            retval.then(next);
          } else {
            next();
          }
        }
      }))
    );
    return this;
  }
};

const wsClient = new SubscriptionClient(`${urls.wsapi}/subscribe`, {
  reconnect: true,
  connectionParams: {}
});
const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(networkInterface, wsClient);

const createClient = () => {
  fetch.applyAfterware([errorAfterware]);

  const client = new ApolloClient({
    networkInterface: networkInterfaceWithSubscriptions,
    dataIdFromObject: r => (r.id && `${r.__typename}:${r.id}`) || null,
    reduxRootSelector: state => state.apollo,
    connectToDevTools: process.env.NODE_ENV === 'development'
  });
  return client;
};

export const client = createClient();

export const apolloMiddleware = () => client.middleware();

export const apolloReducer = client.reducer();

export default function withApollo({ middlewares = [], afterwares = [] }) {
  fetch.applyMiddleware(middlewares).applyAfterware(afterwares);
  return WrappedComponent =>
    // eslint-disable-next-line
    class Provider extends Component {
      static propTypes = {
        store: PropTypes.object.isRequired
      };
      render() {
        const { store } = this.props;
        return (
          <ApolloProvider store={store} client={client}>
            <WrappedComponent store={store} client={client} />
          </ApolloProvider>
        );
      }
    };
}
