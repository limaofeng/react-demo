import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { unload } from './reducers';

@connect(
  ({ ui: { loading } }) => ({
    loading
  }),
  dispatch => ({
    loadOver: () => dispatch(unload())
  })
)
class LoadContainer extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    loading: PropTypes.bool.isRequired,
    loadOver: PropTypes.func.isRequired
  };
  componentDidMount() {
    const { loading, loadOver } = this.props;
    if (loading) {
      setTimeout(loadOver, 1000);
    }
  }
  render() {
    const { children, loading } = this.props;
    return (
      <div>
        <div className={classnames('loading-container', { 'loading-inactive': !loading })}>
          <div className="loader" />
        </div>
        {children}
      </div>
    );
  }
}

export default LoadContainer;
