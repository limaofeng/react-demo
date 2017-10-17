import React, { Component } from 'react';
import PropTypes from 'prop-types';

class LockContainer extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired
  };
  componentDidMount() {
    window.requestAnimationFrame(() => {
      $('.mask-container')
        .prevAll('.main-container,.navbar')
        .removeClass('unmasking')
        .addClass('masking');
    });
  }

  render() {
    const { children } = this.props;
    const locking = false;
    if (!locking) {
      return children;
    }
    return (
      <div>
        <div className="masking">{children}</div>
        <div className="mask-container">
          <div className="lock-container animated fadeInDown">
            <div className="lock-box text-align-center">
              <div className="lock-username">DIVYIA PHILLIPS</div>
              <img src={`${__PUBLIC_URL__}/assets/img/avatars/divyia.jpg`} alt="divyia avatar" />
              <div className="lock-password">
                <form className="form-inline" action="index.html">
                  <div className="form-group">
                    <span className="input-icon icon-right">
                      <input className="form-control" placeholder="Password" type="password" />
                      <i className="glyphicon glyphicon-log-in themeprimary" />
                    </span>
                  </div>
                </form>
              </div>
            </div>
            <div className="signinbox">
              <span>切换其他用户登录?</span>
              <a>去登录</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LockContainer;
