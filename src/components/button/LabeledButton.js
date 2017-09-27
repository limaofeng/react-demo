import React, { Component } from 'react';
import classnames from 'classnames';

class LabeledButton extends Component {
  render() {
    return (
      <a className={this.props.classname} style={this.props.style} onClick={this.props.onClick} href="javascript:void(0);">{this.props.before} <i className={this.props.icon} /> {this.props.after}</a>
    );
  }
}
export default LabeledButton;
