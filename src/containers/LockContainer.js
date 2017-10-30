import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class LockContainer extends Component {
  constructor(props) {
    super(props);
    this.container = document.createElement('div');
    this.container.className = 'mask-container';
    document.body.appendChild(this.container);
  }

  componentDidMount() {
    this.masking();
  }

  componentWillUnmount() {
    this.unmasking();
  }

  masking = () => {
    window.requestAnimationFrame(() => {
      $('.mask-container')
        .siblings('div')
        .addClass('masking');
    });
  };

  unmasking = () => {
    $('.mask-container')
      .siblings('div')
      .removeClass('masking');
    document.body.removeChild(this.container);
  };

  render() {
    return ReactDOM.createPortal(
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
      </div>,
      this.container
    );
  }
}

export default LockContainer;
