import React, { Component, PropTypes } from 'react';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { addGraphQLSubscriptions } from 'add-graphql-subscriptions';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';

import { start, done } from './apollo/middleware/nanobar';

const urls = {
    wsapi: process.env.REACT_APP_URLS_WSAPI,
    api: process.env.REACT_APP_URLS_API,
}

const wsClient = new SubscriptionClient(`${urls.wsapi}/subscribe`, {
    reconnect: true,
});

const networkInterface = createNetworkInterface({ uri: `${urls.api}/graphql` });

// NProgress.configure({ easing: 'ease', speed: 500 });

/*
{
    applyMiddleware(req, next) {
        const nanobar = new Nanobar(options);
        console.log('-------nanobar------');
        nanobar.go(30);
        next();
    }
}
*/

networkInterface.use([start, {
    applyMiddleware(req, next) {
        if (!req.options.headers) {
            req.options.headers = {}; // Create the header object if needed.
        }
        next();
    }
}]).useAfter([{
    applyAfterware({ response }, next) {
        // 解决 TypeError: Already read 异常
        response.json = (prom => () => new Promise((resolve, reject) => {
            prom.then(resolve).catch(reject);
        }))(response.json().then(result => {
            const { errors } = result;
            if (errors) {
                console.error(errors);
                if (errors.some(({ statusCode }) => statusCode === 401)) {
                    console.error('logout', errors)
                }
                if (errors.some(({ data: { code } }) => code === 100503)) {
                    console.error('logout', errors)
                }
            }
            return result;
        }));
        // NProgress.done();
        next();
    }
}, done]);
const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
    networkInterface,
    wsClient
);
const client = new ApolloClient({
    networkInterface: networkInterfaceWithSubscriptions,
    dataIdFromObject: r => (r.id && `${r.__typename}:${r.id}`) || null,
    reduxRootSelector: state => state.apollo,
    connectToDevTools: process.env.NODE_ENV === 'development'
});

export const apolloMiddleware = () => client.middleware();

export const apolloReducer = client.reducer();

export default function withApollo() {
    return WrappedComponent => class Provider extends Component {
        static propTypes = {
            store: PropTypes.object.isRequired,
        }
        render() {
            const { store } = this.props;
            return (<ApolloProvider store={store} client={client}>
                <WrappedComponent store={store} client={client} />
            </ApolloProvider>)
        }
    };
}
