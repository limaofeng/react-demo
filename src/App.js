import React, { Component } from 'react'

// 集成 Redux
import withRedux from './decorators/withRedux';
// 集成 Apollo 
import withApollo, { apolloMiddleware, apolloReducer } from './decorators/withApollo';
// 集成 React-Router
import withRouter, { routerMiddleware, routerReducer, compatibleRouterMiddleware } from './decorators/withRouter';

// Redux 配置
import reducers from './reducers'

// Router 配置
import { routes } from './RouteConfig';

@withRedux({
    middlewares: [
        apolloMiddleware(),
        routerMiddleware(),
        compatibleRouterMiddleware()
    ],
    reducers: {
        ...reducers,
        apollo: apolloReducer,
        routing: routerReducer
    }
})
@withApollo()
@withRouter({ routes: routes() })
export default class App extends Component {
    render() {
        return <div className="empty" />
    }
}
