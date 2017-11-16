import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

// import PageLayout from '../../../app/PageLayout';
import LoginForm from '../components/LoginForm';

class LoginView extends React.PureComponent {
  state = {
    errors: []
  };

  onSubmit = login => async values => {
    const result = await login(values);

    if (result.errors) {
      this.setState({ errors: result.errors });
    }
  };

  render() {
    const { login } = this.props;
    const { errors } = this.state;
    const renderMetaData = () => (
      <Helmet
        title="Login"
        meta={[
          {
            name: 'description',
            content: 'Login page'
          }
        ]}
      />
    );

    return (
      <div className="login-container animated fadeInDown">
        {renderMetaData()}
        <div className="loginbox bg-white">
          <div className="loginbox-title">登录</div>
          <LoginForm login={login} />
          <div className="loginbox-textbox">
            <input type="text" className="form-control" placeholder="Email" />
          </div>
          <div className="loginbox-textbox">
            <input type="text" className="form-control" placeholder="Password" />
          </div>
          <div className="loginbox-forgot">
            <a href="">找回密码?</a>
          </div>
          <div className="loginbox-submit">
            <input type="button" className="btn btn-primary btn-block" value="Login" />
          </div>
          <div className="error">{errors}</div>
          <div className="loginbox-signup">
            <a href="register.html">通过邮箱注册</a>
          </div>
          <div className="loginbox-or">
            <div className="or-line" />
            <div className="or">OR</div>
          </div>
          <div className="loginbox-social">
            <div className="social-title ">连接你的社交账户</div>
            <div className="social-buttons">
              <a href="" className="button-facebook">
                <i className="social-icon fa fa-facebook" />
              </a>
              <a href="" className="button-twitter">
                <i className="social-icon fa fa-twitter" />
              </a>
              <a href="" className="button-google">
                <i className="social-icon fa fa-google-plus" />
              </a>
            </div>
          </div>
        </div>
        <div className="logobox" />
      </div>
    );
  }
}

LoginView.propTypes = {
  login: PropTypes.func.isRequired
};

export default LoginView;
