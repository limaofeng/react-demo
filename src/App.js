import { Component } from 'react';
import PropTypes from 'prop-types';
import { combineReducers } from 'redux-immutable';
// 集成 Redux + Apollo + React-Router
import {
  redux as withRedux,
  apollo as withApollo,
  router as withRouter,
  routerMiddlewares,
  routerReducer
} from 'walkuere';
// Router 与 Redux 配置
import modules from './modules';

import { api, wsapi } from './helpers/urls';

// import withRouter, { routerMiddleware, routerReducer, compatibleRouterMiddleware } from './decorators/withRouter';

import './App.less';

const debug = process.env.NODE_ENV === 'development';

const { reducers, routes, middlewares, afterwares } = modules;
console.log(withApollo, reducers, withRedux, routes, combineReducers);

@withRedux({
  middlewares: routerMiddlewares(),
  reducers: {
    modules: combineReducers(reducers),
    routing: routerReducer
  },
  debug
})
@withApollo({
  uri: api,
  wsUri: wsapi,
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
