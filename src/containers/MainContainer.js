import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { connector as Feature, PrivateRoute } from 'walkuere';

import { PageSidebar, Navbar, ChatBar, PageContent } from '../components';
import LoadContainer from './LoadContainer';
import LockContainer from './LockContainer';

import modules from '../modules';

import reducers, { unload } from './reducers';

@connect(
  ({ modules }) => ({
    user: modules.get('currentUser') ? modules.get('currentUser').toObject() : null,
    loading: modules.get('ui').get('loading')
  }),
  dispatch => ({
    loadOver: () => dispatch(unload())
  })
)
class MainContainer extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    loadOver: PropTypes.func.isRequired
  };
  componentDidMount() {
    const { loading, loadOver } = this.props;
    if (loading) {
      setTimeout(loadOver, 2000);
    }
  }
  render() {
    const { routes, user, loading, children } = this.props; // eslint-disable-line
    const containers = [
      <Navbar />,
      <div className="main-container container-fluid">
        <div className="page-container">
          <PageSidebar uid={user.id} />
          <ChatBar />
          <PageContent breadcrumbs={modules.navItems}>
            <Switch>{modules.pages}</Switch>
          </PageContent>
        </div>
      </div>
    ];
    if (loading) {
      containers.push(<LoadContainer key="load-container" />);
    }
    const locking = false;
    if (locking) {
      containers.push(<LockContainer key="lock-container" />);
    }
    return containers;
  }
}

export default new Feature({
  route: <PrivateRoute path="/" component={MainContainer} />,
  reducer: { ui: reducers }
});
