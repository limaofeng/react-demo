import React from 'react';
import { Route } from 'react-router-dom';

import PrivateRoute from './PrivateRoute';

/*
const fakeAuth = {
    isAuthenticated: false,
    authenticate(cb) {
        this.isAuthenticated = true;
        setTimeout(cb, 100); // fake async
    },
    signout(cb) {
        this.isAuthenticated = false;
        setTimeout(cb, 100);
    }
}; */

// const WithPrivateRoute = connect(({ auth: user }) => ({ user }))(PrivateRoute);

export const RouteWithSubRoutes = route => {
  if (route.access === 'Public') { // default Protected
    return (<Route
      path={route.path}
      exact={route.exact}
      render={props => (
        <route.component {...props} routes={route.routes} />
      )}
    />);
  }
  return (<PrivateRoute {...route} />);
};

export default { RouteWithSubRoutes };
