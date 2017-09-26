import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import { Icon } from 'antd';

class Extra extends Component {
    static propTypes = {
        children: PropTypes.any,
        content: PropTypes.any
    }

    static defaultProps = {
        children: null,
        content: null,
    }

    render() {
        const { children, content } = this.props;
        return (<div>{ children || content }</div>);
    }
}

class Settings extends Component {
    static propTypes = {
        handleClose: PropTypes.func.isRequired,
        title: PropTypes.string.isRequired,
        children: PropTypes.any.isRequired,
        content: PropTypes.element.isRequired,
        extras: PropTypes.array.isRequired
    }

    constructor(props) {
        super(props);
        this.state = {
            next: false,
            nextIndex: 0
        };
    }

    handleOpenNextSettings = index => () => {
        this.setState({ next: true, nextIndex: index });
    }

    handleCloseNextSettings = () => {
        this.setState({ next: false });
    }

    render() {
        const { handleClose, title, children, content, extras } = this.props;
        const { next, nextIndex } = this.state;
        return (
            <div className="settings-menu-container">
                <div id="entry-controls">
                    <div className={classnames('settings-menu settings-menu-pane', { 'settings-menu-pane-in': !next, 'settings-menu-pane-out-left': next })}>
                        <div className="settings-menu-header">
                            <h4>{title}</h4>
                            <button type="button" className="close" onClick={handleClose}><Icon type="close" /></button>
                        </div>
                        <div className="settings-menu-content">
                            {children || content}
                            <ul className="nav-list-block">
                                {extras.map(({ props: { title: extTitle, summary } }, i) => {
                                    const lis = [<li className="nav-list-item" onClick={this.handleOpenNextSettings(i)} role="none">
                                        <button type="button">
                                            <b>{extTitle}</b>
                                            <span>{summary}</span>
                                        </button>
                                        <Icon type="right" />
                                    </li>];
                                    if (i !== (extras.length - 1)) {
                                        lis.push(<li className="divider" />);
                                    }
                                    return lis;
                                })}
                            </ul>
                        </div>
                    </div>
                    <div className={classnames('settings-menu settings-menu-pane', { 'settings-menu-pane-in': next, 'settings-menu-pane-out-right': !next })}>
                        <div className="ember-view active">
                            <div className="settings-menu-header subview">
                                <button className="back settings-menu-header-action" onClick={this.handleCloseNextSettings}><Icon type="left" /></button>
                                <h4>{extras.length && extras[nextIndex].props.title}</h4>
                                <div />
                            </div>
                            <div className="settings-menu-content">
                                {extras.length && extras[nextIndex]}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Settings.ExtraSettings = Extra;

export default Settings;
