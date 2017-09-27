import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { Switch } from 'react-router-dom';

import { PageSidebar, Navbar, ChatBar, PageContent, /* MaskContainer, */ } from '../components';
import LoadContainer from './LoadContainer';
import LockContainer from './LockContainer';
// import { RouteWithSubRoutes } from '../decorators/router';

import modules from '../modules';

@connect(({ auth: user }) => ({
  user
}))
export default class Main extends Component {
    static propTypes = {
      routes: PropTypes.array.isRequired,
      user: PropTypes.object.isRequired
    }
    render() {
      const { routes, user,children } = this.props;// eslint-disable-line
      console.log('----------------------------------', this.props);
      return (
        <LoadContainer>
          <LockContainer>
            <div>
              <Navbar />
              <div className="main-container container-fluid">
                <div className="page-container">
                  <PageSidebar uid={user.id} />
                  <ChatBar />
                  <PageContent >
                    <Switch>
                      {modules.routes}
                      {/* (routes || []).map((route, i) => (
                        <RouteWithSubRoutes key={i} {...route} />
                      )) */ }
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
