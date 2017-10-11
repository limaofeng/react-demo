import React, { Component } from 'react';
import classnames from 'classnames';

class Button extends Component {
  render() {
    const { onClick, type, name, className, children } = this.props;

    switch (type) {
      case 'submit' || 'button':
        return (
          <button onClick={onClick} type="submit" className={classnames('btn', className)}>
            {name || children}
          </button>
        );
      default:
        return (
          <a onClick={onClick} href="javascript:void(0);" className={classnames('btn', className)}>
            {name || children}
          </a>
        );
    }
  }
}

export default Button;
