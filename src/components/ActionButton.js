import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router-dom';

// import { FloatingActionButton } from 'material-ui';
// import ContentAdd from 'material-ui/svg-icons/content/add';

@withRouter
class Add extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    to: PropTypes.any,
    onClick: PropTypes.func
  };

  static defaultProps = {
    onClick: null,
    to: null
  };

  handleClick = () => {
    const { onClick: forward, to, history: { push } } = this.props;
    (forward ||
      (() => {
        if (typeof to === 'string') {
          push(to);
        } else {
          const { path, state = null } = to;
          push(path, state);
        }
      }))(this.props);
  };

  render() {
    return (
      <div className="fixed-bottom">
        {/*
            <FloatingActionButton secondary onClick={this.handleClick} >
                <ContentAdd />
            </FloatingActionButton>
            */}
      </div>
    );
  }
}

export default { Add };
