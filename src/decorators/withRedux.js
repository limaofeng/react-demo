import React from 'react';
// import createHistory from 'history/createBrowserHistory';

// import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { persistState } from 'redux-devtools';
// import LogRocket from 'logrocket';
import middleware from './redux/middleware';
// import reducer from './modules/reducer';
import DevTools from './redux/DevTools';

function getDebugSessionKey() {
    // You can write custom logic here!
    // By default we try to read the key from ?debug_session=<key> in the address bar
    const matches = window.location.href.match(/[?&]debug_session=([^&]+)\b/);
    return (matches && matches.length > 0) ? matches[1] : null;
}

const createReduxStore = (usageMiddlewares = [], reducer = {}) => {
    let finalCreateStore;
    if (process.env.NODE_ENV === 'development') {
        finalCreateStore = compose(
            applyMiddleware.apply(this, middleware.concat(usageMiddlewares)),
            // Provides support for DevTools:
            window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument(),
            // Optional. Lets you write ?debug_session=<key> in address bar to persist debug sessions
            persistState(getDebugSessionKey())
        )(createStore);
    } else {
        finalCreateStore = compose(
            applyMiddleware.apply(this, middleware.concat(usageMiddlewares)) // .concat(LogRocket.reduxMiddleware())
        )(createStore);
    }
    return finalCreateStore(combineReducers(reducer));
};

export default function withRedux({ middlewares = [], reducers = {} }) {
    const store = createReduxStore(middlewares, reducers);
    return WrappedComponent => () => <WrappedComponent store={store} />
}
