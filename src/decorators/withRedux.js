import React from 'react';
// import createHistory from 'history/createBrowserHistory';

// import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { persistState } from 'redux-devtools';
// import LogRocket from 'logrocket';
import defaultMiddleware from './redux/middleware';
// import reducer from './modules/reducer';
import DevTools from './redux/DevTools';

function getDebugSessionKey() {
  // You can write custom logic here!
  // By default we try to read the key from ?debug_session=<key> in the address bar
  const matches = window.location.href.match(/[?&]debug_session=([^&]+)\b/);
  return matches && matches.length > 0 ? matches[1] : null;
}

const createReduxStore = (middlewares = [], reducers = {}, debug) => {
  let finalCreateStore;
  if (debug) {
    finalCreateStore = compose(
      applyMiddleware.apply(this, defaultMiddleware.concat(middlewares)),
      // Provides support for DevTools:
      window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument(),
      // Optional. Lets you write ?debug_session=<key> in address bar to persist debug sessions
      persistState(getDebugSessionKey())
    )(createStore);
  } else {
    finalCreateStore = compose(
      applyMiddleware.apply(this, defaultMiddleware.concat(middlewares)) // .concat(LogRocket.reduxMiddleware())
    )(createStore);
  }
  return finalCreateStore(combineReducers(reducers));
};

let store = null;

export default function withRedux({ middlewares = [], reducers = {}, debug = false }) {
  if (!store) {
    store = createReduxStore(middlewares, reducers, debug);
  } else {
    store.replaceReducer(combineReducers(reducers));
  }
  return WrappedComponent => () => {
    if (debug && !window.devToolsExtension) {
      return (
        <div>
          <DevTools store={store} />
          <WrappedComponent store={store} />
        </div>
      );
    }
    return <WrappedComponent store={store} />;
  };
}
