import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Widget extends Component {
  render() {
    const { title, children } = this.props;
    return (
      <div className="widget">
        <div className="widget-header bordered-bottom bordered-blue">
          <span className="widget-caption">{title}</span>
          <div className="widget-buttons">
            <a data-toggle="maximize">
              <i className="fa fa-expand" />
            </a>
          </div>
        </div>
        <div className="widget-body">
          <div>{children}</div>
        </div>
      </div>
    );
  }
}

Widget.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.any.isRequired
};

export default Widget;
