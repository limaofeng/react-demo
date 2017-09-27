import React, { Component } from 'react';
import classnames from 'classnames';

class CircleButton extends Component {
  render() {
    return (
      <a href="javascript:void(0);" onClick={this.props.onClick} className={this.props.classname}><i className={this.props.icon} /></a>
    );
  }
}

export default CircleButton;
