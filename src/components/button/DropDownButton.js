import React, { Component } from 'react';

class DropDownButton extends Component {
    render() {
        return (
            <div className="btn-group">
                <a className="btn btn-blue" href="javascript:void(0);">{this.props.name}</a>
                <a className="btn btn-blue dropdown-toggle" data-toggle="dropdown" href="javascript:void(0);">
                    <i className="fa fa-angle-down" /></a>
                <ul className="dropdown-menu dropdown-blue">
                    {this.props.children}
                </ul>
            </div>
        );
    }
}

export default DropDownButton;
