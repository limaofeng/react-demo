import React, { PropTypes, Component } from 'react';
import { Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import PrivateRoute from '../decorators/router/PrivateRoute';

import { PageSidebar, Navbar, ChatBar, PageContent } from '../components';
import LoadContainer from './LoadContainer';
import LockContainer from './LockContainer';

import Feature from '../modules/connector';
import modules from '../modules';

@connect(({ currentUser: user }) => ({
  user
}))
class MainContainer extends Component {
    static propTypes = {
      user: PropTypes.object.isRequired
    }
    render() {
      const { routes, user,children } = this.props;// eslint-disable-line
      return (
        <LoadContainer>
          <LockContainer>
            <div>
              <Navbar />
              <div className="main-container container-fluid">
                <div className="page-container">
                  <PageSidebar uid={user.id} />
                  <ChatBar />
                  <PageContent breadcrumbs={modules.navItems}>
                    <Switch>
                      {modules.pages}
                    </Switch>
                  </PageContent>
                </div>
              </div>
            </div>
          </LockContainer>
        </LoadContainer>
      );
    }
}

export default new Feature({
  route: <PrivateRoute path="/" component={MainContainer} />
});
