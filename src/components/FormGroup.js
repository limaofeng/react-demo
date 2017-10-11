import React, { Component, PropTypes } from 'react';

class FormGroup extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    children: PropTypes.any.isRequired
  };

  render() {
    const { label, children } = this.props;
    return (
      <div className="form-group">
        <label htmlFor="next">{label}</label>
        {children}
      </div>
    );
  }
}

export default FormGroup;
