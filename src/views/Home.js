import React from 'react';
import { Button } from 'antd';

import logo from './../logo.svg';
import PageBody from './../components/PageBody';

import Articles from './ArticleList';

function Home() {
  return (
    <PageBody>
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React </h2>
        </div>
        <p className="App-intro">
                    To get started, edit <code>src/App.js</code> and save to reload.<Button type="primary">xxxx</Button>
        </p>
        <Articles />
      </div>
    </PageBody>
  );
}

export default Home;
