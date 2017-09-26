import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { loadOver } from './../reducers/ui'

@connect(({ ui: { loading } }) => ({
    loading
}), dispatch => ({
    loadOver: () => dispatch(loadOver()),
}))
class LoadingContainer extends Component {
    static propTypes = {
        children: PropTypes.any.isRequired,
        loading: PropTypes.bool.isRequired,
        loadOver: PropTypes.func.isRequired
    }
    componentDidMount() {
        const { loading, loadOver } = this.props
        if (loading) {
            setTimeout(loadOver, 300);
        }
    }
    render() {
        const { children, loading } = this.props;
        if (loading) {
            return (<div className="loading-container">
                <div className="loader" />
            </div>)
        }
        return children;
    }
}

export default LoadingContainer;
