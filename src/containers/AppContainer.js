import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { AppContainer as ReactHotContainer } from 'react-hot-loader';

/*
if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line no-unused-vars,react/no-deprecated
  let createClass = React.createClass;
  Object.defineProperty(React, 'createClass', {
    set: nextCreateClass => {
      createClass = nextCreateClass;
    },
  });
  const { whyDidYouUpdate } = require('why-did-you-update');
  whyDidYouUpdate(React);
} */

class AppContainer extends Component {
  static propTypes = {
    children: PropTypes.any.isRequired
  };
  render() {
    const { children } = this.props;
    if (process.env.NODE_ENV === 'development') {
      return <ReactHotContainer>{children}</ReactHotContainer>;
    }
    return children;
  }
}

export default AppContainer;
