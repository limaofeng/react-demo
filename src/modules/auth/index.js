import React from 'react';
import { Route } from 'react-router-dom';
import { connector as Feature } from 'walkuere';

// Component and helpers
// import Profile from './containers/Profile';
// import Users from './containers/Users';
// import Register from './containers/Register';
import Login from './containers/Login';
import reducers from './reducers';

// import { AuthRoute, AuthNav, AuthLogin, AuthProfile } from './containers/Auth';

import REFRESHTOKEN from './graphqls/refreshToken.graphql';

const loadToken = (() => {
  let status = 'ready';
  const currentUser = () => JSON.parse(localStorage.getItem('auth'));
  let cache = new Promise(resolve => {
    const user = currentUser();
    resolve(user && user.token);
  });
  return client => {
    const user = currentUser();
    if (!user) {
      return cache;
    }
    const { token: { tokenCreationTime, reExpiresIn, refreshToken, expiresIn } } = user;
    if ((Date.now() - tokenCreationTime) / 1000 < expiresIn - 10) {
      // Token 即将过期时，自动刷新
      console.log((Date.now() - tokenCreationTime) / 1000, expiresIn);
      return cache;
    }
    if ((Date.now() - tokenCreationTime) / 1000 > reExpiresIn - 10) {
      // 超出刷新时间
      localStorage.removeItem('auth');
      cache = new Promise(resolve => {
        resolve();
      });
      return cache;
    }
    if (status === 'ready') {
      status = 'pending';
      cache = client
        .mutate({
          mutation: REFRESHTOKEN,
          variables: { clientId: 'ff80808155005dfb0155005e4fb90000', refreshToken }
        })
        .then(({ data: { token } }) => {
          status = 'ready';
          localStorage.setItem('auth', JSON.stringify({ ...user, token }));
          return token;
        });
    }
    return cache;
  };
})();

async function tokenMiddleware(req, options, client) {
  const token = await loadToken(client);
  if (token) {
    options.headers.Authorization = `Token ${token.accessToken}`;
  }
}

async function tokenAfterware(res, options) {
  const token = options.headers['x-token'];
  const refreshToken = options.headers['x-refresh-token'];
  if (token) {
    window.localStorage.setItem('token', token);
  }
  if (refreshToken) {
    window.localStorage.setItem('refreshToken', refreshToken);
  }
  console.log(res, options);
}

console.log(tokenMiddleware, tokenAfterware);

function connectionParam() {
  return {
    token: window.localStorage.getItem('token'),
    refreshToken: window.localStorage.getItem('refreshToken')
  };
}

export default new Feature({
  route: [
    // <AuthRoute exact path="/profile" role="user" component={Profile} />,
    // <AuthRoute exact path="/users" role="admin" component={Users} />,
    // <Route exact path="/register" component={Register} />,
    <Route exact path="/login" component={Login} />
  ],
  /*
  navItem: [
    <NavItem>
      <AuthNav role="admin">
        <NavLink to="/users" className="nav-link" activeClassName="active">
          Users
        </NavLink>
      </AuthNav>
    </NavItem>
  ],
  navItemRight: [
    <NavItem>
      <AuthProfile />
    </NavItem>,
    <NavItem>
      <AuthLogin>
        <span className="nav-link">
          <NavLink to="/login" activeClassName="active">
            Login
          </NavLink>{' '}
          /{' '}
          <NavLink to="/register" activeClassName="active">
            Register
          </NavLink>
        </span>
      </AuthLogin>
    </NavItem>
  ],
  */
  reducer: { auth: reducers },
  // middleware: tokenMiddleware,
  // afterware: tokenAfterware,
  connectionParam
});
