import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class Ovarlay extends Component {
  constructor(props) {
    super(props);
    this.container = document.createElement('div');
    document.body.appendChild(this.container);
  }

  componentWillUnmount() {
    document.body.removeChild(this.container);
  }

  render() {
    return ReactDOM.createPortal(<div className="overlay">{this.props.children}</div>, this.container);
  }
}

export default Ovarlay;
