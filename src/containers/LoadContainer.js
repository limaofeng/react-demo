import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class LoadContainer extends Component {
  constructor(props) {
    super(props);
    this.container = document.createElement('div');
    this.container.className = 'loading-container';
    document.body.appendChild(this.container);
  }
  componentWillUnmount() {
    document.body.removeChild(this.container);
  }

  render() {
    return ReactDOM.createPortal(<div className="loader" />, this.container);
    /* [
      <div className={classnames('loading-container', { 'loading-inactive': !loading })}>
        <div className="loader" />
      </div>,
      children
    ]; */
  }
}

export default LoadContainer;
