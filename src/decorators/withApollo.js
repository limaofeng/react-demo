import React, { Component, PropTypes } from 'react';
import { addGraphQLSubscriptions } from 'subscriptions-transport-ws';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';

import Nanobar from 'nanobar';

const urls = {
    wsapi: 'ws://dev.zbsg.com.cn:8090',
    api: 'http://dev.zbsg.com.cn'
}
/*
const wsClient = new SubscriptionClient(`${urls.wsapi}/subscribe`, {
    reconnect: true
}); */

const networkInterface = createNetworkInterface({ uri: `${urls.api}/graphql` });

// NProgress.configure({ easing: 'ease', speed: 500 });

networkInterface.use([{
    applyMiddleware(req, next) {
        const options = {
            classname: 'my-class',
            id: 'my-id',
            target: document.getElementById('root')
        };
        const nanobar = new Nanobar(options);
        console.log('-------nanobar------');
        nanobar.go(30);
        next();
    }
}, {
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
}]);
console.warn('addGraphQLSubscriptions = ', addGraphQLSubscriptions)
/*
const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
    networkInterface,
    wsClient
); */
const client = new ApolloClient({
    networkInterface,
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
