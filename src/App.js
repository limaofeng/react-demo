import React, { Component } from 'react'

import withRedux from './decorators/withRedux';
import withApollo, { apolloMiddleware, apolloReducer } from './decorators/withApollo';
import withRouter, { routerMiddleware, routerReducer, compatibleRouterMiddleware } from './decorators/withRouter';
import reducers from './reducers'

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
class App extends Component {
    constructor(props) {
        super(props);
        console.log('new App')
    }
    render() {
        return <div className="empty" />
    }
}

export default App
