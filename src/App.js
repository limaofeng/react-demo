import React, { Component, PropTypes } from 'react';

// 集成 Redux
import withRedux from './decorators/withRedux';
// 集成 Apollo
import withApollo, { apolloMiddleware, apolloReducer } from './decorators/withApollo';
// 集成 React-Router
import withRouter, { routerMiddleware, routerReducer, compatibleRouterMiddleware } from './decorators/withRouter';

import reducers from './reducers';

// Router 与 Redux 配置
import modules from './modules';

@withRedux({
  middlewares: [apolloMiddleware(), routerMiddleware(), compatibleRouterMiddleware()],
  reducers: {
    ...reducers,
    ...modules.reducers,
    apollo: apolloReducer,
    routing: routerReducer
  }
})
@withApollo()
@withRouter({ routes: modules.routes })
export default class App extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired
  };
  render() {
    const { children } = this.props;
    return <div>{children}</div>;
  }
}
