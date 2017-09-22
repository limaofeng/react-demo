import React, { Component, PropTypes } from 'react';
import { Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import { RouteWithSubRoutes } from './../decorators/router'

@connect(({ auth: user }) => ({
    user
}))
class Main extends Component {
    static propTypes = {
        routes: PropTypes.array.isRequired,
        user: PropTypes.object.isRequired
    }
    render() {
        const { routes, user } = this.props;
        return (
            <div>
                App 内容123 {user.nickName} 你好啊！112
                <Switch>
                    {routes.map((route, i) => (
                        <RouteWithSubRoutes key={i} {...route} />
                    ))}
                </Switch>
            </div>
        );
    }
}

export default Main;
