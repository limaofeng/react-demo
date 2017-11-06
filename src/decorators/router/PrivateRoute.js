import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

@connect(({ modules }) => ({ user: modules.get('currentUser') ? modules.get('currentUser').toObject() : null }))
export default class PrivateRoute extends Route {
  render() {
    const { user, ...route } = this.props;
    if (route.to) {
      return <Redirect exact from={route.path} to={route.to} />;
    }
    return (
      <Route
        path={route.path}
        exact={route.exact}
        render={props => {
          if (!user) {
            return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />;
          }
          return <route.component {...props} routes={route.routes} />;
        }}
      />
    );
  }
}
