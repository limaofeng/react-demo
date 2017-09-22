import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

@connect(({ auth: user }) => ({ user }))
export default class PrivateRoute extends Route {
    render() {
        const { user, ...route } = this.props;
        if (route.to) {
            return <Redirect exact from={route.path} to={route.to} />;
        }
        return (<Route
            path={route.path}
            exact={route.exact}
            render={props => {
                if (!user) {
                    return (<Redirect to={{ pathname: '/login', state: { from: props.location } }} />);
                }
                if (!this.state.load && route.onEnter) { // TODO 适配 React-outer V3 onEnter 写法
                    route.onEnter({ params: props.match.params, location: props.location });
                    this.state.load = true;
                }
                return (<route.component {...props} routes={route.routes} />);
            }}
        />);
    }
}
