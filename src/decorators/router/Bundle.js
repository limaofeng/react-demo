import React from 'react';
import PropTypes from 'prop-types';

class Bundle extends React.Component {
  state = {
    mod: null // short for "module" but that's a keyword in js, so "mod"
  };

  // 加载初始状态
  componentWillMount() {
    this.load(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.load !== this.props.load) {
      this.load(nextProps);
    }
  }

  load({ load }) {
    // 重置状态
    this.setState({
      mod: null
    });
    // 传入组件的组件
    load(mod => {
      load.lazyRouteComponent = mod.default ? mod.default : mod;
      this.setState({
        // handle both es imports and cjs
        mod: load.lazyRouteComponent
      });
    });
  }

  render() {
    // if state mode not undefined,The container will render children
    return this.state.mod ? this.props.children(this.state.mod) : null;
  }
}

Bundle.propTypes = {
  load: PropTypes.func.isRequired,
  children: PropTypes.func.isRequired
};

export default Bundle;
