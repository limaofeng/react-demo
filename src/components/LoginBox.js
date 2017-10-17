import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { push } from 'react-router-redux';
import { Route, Redirect, withRouter } from 'react-router-dom';
import classnames from 'classnames';
import { reduxForm } from 'redux-form';
import gql from 'graphql-tag';
import { connect } from 'react-redux';
import { graphql, withApollo } from 'react-apollo';
import { Form, Icon, Input, Button, Checkbox, message } from 'antd';

import GRQPHQL_LOGIN from './../graphqls/login.graphql';

import { save } from '../reducers/auth';

const FormItem = Form.Item;

@graphql(GRQPHQL_LOGIN, {
  props: props => ({
    ...props,
    login: (username, password) =>
      props.mutate({
        variables: { username, password }
      })
  })
})
@withRouter
@connect()
@Form.create()
class LoginBox extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    login: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired
  };

  state = {
    redirectToReferrer: false
  };

  handleClick = status => {
    $('.masking-container > div')
      .removeClass('animated fadeInDown')
      .addClass('animated fadeOutUp')
      .delay(1000, 'mx')
      .queue('mx', () => {}); // MaskActions.switch(status)).dequeue('mx');
    if (!status) {
      $('.masking-container')
        .delay(1000)
        .hide(0)
        .prevAll('div')
        .removeClass('masking')
        .addClass('unmasking');
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    const { login, form: { validateFields, submit }, dispatch } = this.props;
    validateFields((err, { username, password }) => {
      if (!err) {
        console.log(username, password);
        submit(() => {
          login(username, password)
            .then(({ data: { login: user } }) => {
              $('#loginBox')
                .removeClass('animated fadeInDown')
                .addClass('animated fadeOutUp')
                .delay(1000, 'mx')
                .queue('mx', () => {
                  dispatch(save(user));
                  this.setState({ redirectToReferrer: true });
                })
                .dequeue('mx');
            })
            .catch(({ graphQLErrors }) => {
              const errorMessages = graphQLErrors.map(({ data }) => data.message);
              message.error(errorMessages);
            }); // .then(reset).catch(reset);
        });
      }
    });
  };

  render() {
    const { form: { getFieldDecorator, isSubmitting }, location: { state } } = this.props;

    const { from } = state || { from: { pathname: '/' } };
    const { redirectToReferrer } = this.state;

    console.log(from);

    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }

    const submitting = isSubmitting();

    return (
      <div className="animated fadeInDown" id="loginBox">
        <div className="bg-white loginBox boxShadow">
          <div className="logo_div">
            <div className="logoImg" />
          </div>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <div className="titleBox">
              <div className="leftP" />
              <div className="leftLine" />
              <div className="midText">后台登录</div>
              <div className="rightP" />
              <div className="rightLine" />
            </div>
            <FormItem>
              {getFieldDecorator('username', {
                rules: [{ required: true, message: '请输入您的用户名!' }]
              })(<Input prefix={<Icon type="user" style={{ fontSize: 14 }} />} placeholder="Username" />)}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入您的密码!' }]
              })(
                <Input prefix={<Icon type="lock" style={{ fontSize: 14 }} />} type="password" placeholder="Password" />
              )}
            </FormItem>
            <div className="buttonCtr">
              <Button type="primary" disabled={submitting} htmlType="submit" className="btn btn-primary btn-block">
                {submitting ? <i className="fa fa-circle-o-notch fa-spin" /> : '登录'}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

export default LoginBox;
