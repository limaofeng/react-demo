import React, { Component, PropTypes } from 'react';
import { Form, Icon, Input, Button, message } from 'antd';

const FormItem = Form.Item;

@Form.create()
class LoginForm extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    login: PropTypes.func.isRequired
  };
  handleSubmit = e => {
    e.preventDefault();
    const { login, form: { validateFields, submit } } = this.props;
    validateFields((err, { username, password }) => {
      if (err) {
        console.error(err);
        return;
      }
      submit(reset => {
        login(username, password)
          .then(next => {
            $('.loginbox')
              .removeClass('animated fadeInDown')
              .addClass('animated fadeOutUp')
              .delay(1000, 'mx')
              .queue('mx', next)
              .dequeue('mx');
          })
          .catch(error => {
            message.error(error);
          })
          .then(reset)
          .catch(reset);
      });
    });
  };
  render() {
    const { form: { getFieldDecorator, isSubmitting } } = this.props;
    const submitting = isSubmitting();
    return (
      <Form name="login" onSubmit={this.handleSubmit}>
        <FormItem className="loginbox-textbox">
          {getFieldDecorator('username', {
            rules: [{ required: true, message: '请输入您的用户名!' }]
          })(<Input prefix={<Icon type="user" style={{ fontSize: 14 }} />} placeholder="Username" />)}
        </FormItem>
        <FormItem className="loginbox-textbox">
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入您的密码!' }]
          })(<Input prefix={<Icon type="lock" style={{ fontSize: 14 }} />} type="password" placeholder="Password" />)}
        </FormItem>
        <div className="loginbox-submit">
          <input type="button" className="btn btn-primary btn-block" value="Login" />
          {/* btn btn-primary  */}
          <Button type="primary" disabled={submitting} htmlType="submit" className="btn-block">
            {submitting ? <i className="fa fa-circle-o-notch fa-spin" /> : '登录'}
          </Button>
        </div>
      </Form>
    );
  }
}

/* LoginForm.propTypes = {
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  errors: PropTypes.array
}; */

export default LoginForm;
