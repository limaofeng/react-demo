import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { Switch } from 'react-router-dom';

import { PageSidebar, Navbar, ChatBar, PageContent, /* MaskContainer, */ } from '../components';
import LoadingContainer from './LoadingContainer';
import { RouteWithSubRoutes } from '../decorators/router'

// layout.lock.display ? <MaskContainer type={layout.lock.box} /> : [] 

@connect(({ auth: user }) => ({
    user
}))
export default class Main extends Component {
    static propTypes = {
        routes: PropTypes.array.isRequired,
        user: PropTypes.object.isRequired
    }
    render() {
        const { routes, user } = this.props;
        return (
            <LoadingContainer>
                <div>
                    <Navbar />
                    <div className="main-container container-fluid">
                        <div className="page-container">
                            <PageSidebar uid={user.id} />
                            <ChatBar />
                            <PageContent >
                                <Switch>
                                    {(routes || []).map((route, i) => (
                                        <RouteWithSubRoutes key={i} {...route} />
                                    ))}
                                </Switch>
                            </PageContent>
                        </div>
                    </div>
                </div>
            </LoadingContainer>
        );
    }
}
