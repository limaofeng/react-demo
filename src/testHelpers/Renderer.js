import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ApolloClient from 'apollo-client';
import { ApolloLink, Observable } from 'apollo-link';
import InMemoryCache from 'apollo-cache-inmemory';
import { addTypenameToDocument } from 'apollo-utilities';
import { LoggingLink } from 'apollo-logger';
import { JSDOM } from 'jsdom';
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import { combineReducers, applyMiddleware, compose, createStore } from 'redux';
import { graphql, print, getOperationAST } from 'graphql';
import { Provider } from 'react-redux';
import typeDefs from './schema.graphqls';

// 集成 React-Router
import withRouter, {
  history,
  routerMiddleware,
  routerReducer,
  compatibleRouterMiddleware
} from '../decorators/withRouter';

import middleware from '../decorators/redux/middleware';

const dom = new JSDOM('<!doctype html><html><body><div id="root"><div></body></html>');
global.document = dom.window.document;
global.window = dom.window;
global.navigator = dom.window.navigator;

// React imports MUST come after `global.document =` in order for enzyme `unmount` to work
const ReactEnzymeAdapter = require('enzyme-adapter-react-16');
const { ApolloProvider } = require('react-apollo');
const Enzyme = require('enzyme');

function storageMock() {
  const storage = {};
  return {
    setItem(key, value) {
      storage[key] = value || '';
    },
    getItem(key) {
      return key in storage ? storage[key] : null;
    },
    removeItem(key) {
      delete storage[key];
    },
    get length() {
      return Object.keys(storage).length;
    },
    key(i) {
      const keys = Object.keys(storage);
      return keys[i] || null;
    }
  };
}

// mock the localStorage
window.localStorage = storageMock();
// mock the sessionStorage
window.sessionStorage = storageMock();

const modules = require('../modules').default;

const mount = Enzyme.mount;

Enzyme.configure({ adapter: new ReactEnzymeAdapter() });

process.on('uncaughtException', ex => {
  console.error('Uncaught error', ex.stack);
});

class AppTest extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired
  };
  render() {
    const { children } = this.props;
    return <div>{children}</div>;
  }
}

class MockLink extends ApolloLink {
  constructor(schema) {
    super();
    this.schema = schema;
    this.handlers = {};
    this.subscriptions = {};
    this.subscriptionQueries = {};
    this.subId = 1;
  }

  request(request) {
    const self = this;
    const { schema } = self;
    const operationAST = getOperationAST(request.query, request.operationName);
    if (!!operationAST && operationAST.operation === 'subscription') {
      return {
        subscribe(handler) {
          try {
            const subId = self.subId++;
            const queryStr = print(request.query);
            const key = JSON.stringify({
              query: queryStr,
              variables: request.variables
            });
            self.handlers[subId] = {
              handler,
              key,
              query: queryStr,
              variables: request.variables
            };
            self.subscriptions[key] = self.subscriptions[key] || [];
            self.subscriptions[key].push(subId);
            self.subscriptionQueries[queryStr] = self.subscriptionQueries[queryStr] || [];
            self.subscriptionQueries[queryStr].push(subId);
            return {
              unsubscribe() {
                try {
                  const { key, query } = self.handlers[subId];
                  self.subscriptions[key].splice(self.subscriptions[key].indexOf(subId), 1);
                  if (!self.subscriptions[key].length) {
                    delete self.subscriptions[key];
                  }
                  self.subscriptionQueries[query].splice(self.subscriptionQueries[query].indexOf(subId), 1);
                  if (!self.subscriptionQueries[query].length) {
                    delete self.subscriptionQueries[query];
                  }
                  delete self.handlers[subId];
                } catch (e) {
                  console.error(e);
                }
              }
            };
          } catch (e) {
            console.error(e);
          }
        }
      };
    }
    return new Observable(observer => {
      graphql(schema, print(request.query), {}, {}, request.variables, request.operationName)
        .then(data => {
          if (!observer.closed) {
            observer.next(data);
            observer.complete();
          }
        })
        .catch(error => {
          if (!observer.closed) {
            observer.error(error);
          }
        });
    });
  }

  _getSubscriptions(query, variables) {
    const self = this;
    if (!query) {
      return self.subscriptionQueries;
    }
    const queryStr = print(addTypenameToDocument(query));
    const key = JSON.stringify({
      query: queryStr,
      variables: variables || {}
    });
    const subscriptions = (!variables ? self.subscriptionQueries[queryStr] : self.subscriptions[key]) || [];

    return subscriptions.map(subId => {
      const res = {
        next() {
          return self.handlers[subId].handler.next.apply(self, arguments);
        },
        error() {
          return self.handlers[subId].handler.error.apply(self, arguments);
        }
      };
      res.variables = self.handlers[subId].variables;
      return res;
    });
  }
}

export default class Renderer {
  constructor(graphqlMocks, reduxState) {
    const schema = makeExecutableSchema({
      typeDefs
    });
    addMockFunctionsToSchema({ schema, mocks: graphqlMocks });

    const cache = new InMemoryCache();
    const link = new MockLink(schema);

    const client = new ApolloClient({
      link: ApolloLink.from([new LoggingLink()].concat([link])),
      cache
    });

    const store = compose(
      applyMiddleware.apply(this, middleware.concat([routerMiddleware(), compatibleRouterMiddleware()]))
    )(createStore)(
      combineReducers({
        ...modules.reducers,
        apollo: client.reducer(),
        routing: routerReducer
      }),
      reduxState
    );

    this.client = client;
    this.store = store;
    this.history = history;
    this.mockLink = link;
    // this.networkInterface = mockNetworkInterface;
  }

  withApollo(WrappedComponent) {
    const { store, client } = this;

    return (
      <Provider store={store}>
        <ApolloProvider client={client}>
          <WrappedComponent />
        </ApolloProvider>
      </Provider>
    );
  }

  getSubscriptions(query, variables) {
    return this.mockLink._getSubscriptions(query, variables);
  }

  mount(routes) {
    return mount(this.withApollo(withRouter({ routes })(AppTest)));
  }
}
