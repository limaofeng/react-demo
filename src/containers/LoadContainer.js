import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { unload } from './../reducers/ui';

@connect(({ ui: { loading } }) => ({
  loading
}), dispatch => ({
  loadOver: () => dispatch(unload()),
}))
class LoadContainer extends Component {
    static propTypes = {
      children: PropTypes.element.isRequired,
      loading: PropTypes.bool.isRequired,
      loadOver: PropTypes.func.isRequired
    }
    componentDidMount() {
      const { loading, loadOver } = this.props;
      if (loading) {
        setTimeout(loadOver, 1000);
      }
    }
    render() {
      const { children, loading } = this.props;
      if (loading) {
        return (<div className="loading-container">
          <div className="loader" />
          <div style={{ display: 'none' }}>{children}</div>
        </div>);
      }
      return children;
    }
}

export default LoadContainer;
