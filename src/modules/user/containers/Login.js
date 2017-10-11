/* eslint-disable no-undef */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

// Apollo
import { graphql, compose } from 'react-apollo';

// Components
import LoginView from '../components/LoginView';

import LOGIN from '../graphqls/Login.graphql';

import { save } from '../reducers';

class Login extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    login: PropTypes.func.isRequired
  };
  state = {
    redirectToReferrer: false
  };

  login = async (username, password) => {
    const { login } = this.props;
    await login(username, password);
    return () => {
      this.setState({ redirectToReferrer: true });
    };
  };

  render() {
    console.log(this.props);
    const { location: { state } } = this.props;

    const { from } = state || { from: { pathname: '/' } };
    const { redirectToReferrer } = this.state;

    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }
    return <LoginView {...this.props} login={this.login} />;
  }
}

const LoginWithApollo = compose(
  graphql(LOGIN, {
    props: ({ ownProps: { saveUser }, mutate }) => ({
      login: async (username, password) => {
        const { data: { login, errors } } = await mutate({
          variables: { username, password }
        });
        if (errors) {
          throw new Error(errors);
        }
        saveUser(login);
        // const { token, refreshToken } = login.tokens;
        // localStorage.setItem('token', token);
        // localStorage.setItem('refreshToken', refreshToken);
        return login;
      }
    })
  })
)(Login);

export default connect(
  () => ({}),
  dispatch => ({
    saveUser(user) {
      dispatch(save(user));
    }
  })
)(LoginWithApollo);
