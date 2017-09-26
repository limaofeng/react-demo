import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export class Tab extends Component {
    render() {
        const { className, id, children } = this.props;
        return (<div id={id} className={classnames({ 'tab-pane': true, active: className && className.includes('active') })}>
            {children}
        </div>);
    }
}

/*
 <li className="dropdown">
 <a data-toggle="dropdown" className="dropdown-toggle" href="#">
 Dropdown
 <b className="caret"></b>
 </a>
 <ul className="dropdown-menu dropdown-blue">
 <li>
 <a data-toggle="tab" href="#dropdown1">@fat</a>
 </li>

 <li>
 <a data-toggle="tab" href="#dropdown2">@mdo</a>
 </li>
 </ul>
 </li>
 */

class Tabs extends Component {
    render() {
        const { children } = this.props;

        return (<div className="tabbable">
            <ul className="nav nav-tabs" id="myTab">
                {
                    React.Children.map(children, child => (<li className={classnames(child.props.className)} onClick={child.props.onClick}>
                        <a data-toggle="tab" href={`#${child.props.id}`}>
                            {child.props.title}
                        </a>
                    </li>))
                }
            </ul>
            <div className="tab-content">
                {children}
            </div>
        </div>);
    }
}

export default Tabs;
