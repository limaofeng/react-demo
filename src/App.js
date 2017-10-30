import { Component } from 'react';
import PropTypes from 'prop-types';
import LogRocket from 'logrocket';
import { combineReducers } from 'redux-immutable';
// 集成 Redux
import withRedux from './decorators/withRedux';
// 集成 Apollo
import withApollo, { apolloMiddleware, apolloReducer } from './decorators/withApollo';
// 集成 React-Router
import withRouter, { routerMiddleware, routerReducer, compatibleRouterMiddleware } from './decorators/withRouter';

// Router 与 Redux 配置
import modules from './modules';

import './App.less';

const debug = process.env.NODE_ENV === 'development';

const { reducers, routes, middlewares, afterwares } = modules;

@withRedux({
  middlewares: [LogRocket.reduxMiddleware(), apolloMiddleware(), routerMiddleware(), compatibleRouterMiddleware()],
  reducers: {
    modules: combineReducers(reducers),
    apollo: apolloReducer,
    routing: routerReducer
  },
  debug
})
@withApollo({
  middlewares,
  afterwares,
  debug
})
@withRouter({ routes })
export default class App extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired
  };
  render() {
    return this.props.children;
  }
}
