import React, { Component } from 'react'
import { Button } from 'antd';
import logo from './logo.svg'
import './App.css'

import withRedux from './decorators/withRedux';
import withApollo, { apolloMiddleware, apolloReducer } from './decorators/withApollo';
import withRouter, { routerMiddleware, routerReducer, compatibleRouterMiddleware } from './decorators/withRouter';

import reducers from './reducers'

import { routes } from './RouteConfig';

import Articles from './views/ArticleList';

// eslint-disable-next-line
@withRedux({ middlewares: [
    apolloMiddleware(),
    routerMiddleware(),
    compatibleRouterMiddleware()
],
reducers: {
    ...reducers,
    apollo: apolloReducer,
    routing: routerReducer
} })
@withApollo({ store: null })
@withRouter({ routes: routes() })
class App extends Component {
    constructor(props) {
        super(props);
        console.log('new App')
    }
    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2>Welcome to React </h2>
                </div>
                <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.<Button type="primary">xxxx</Button>
                </p>
                <Articles />
            </div>
        )
    }
}

export default App
