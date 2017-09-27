import React from 'react';
import { Route } from 'react-router-dom';

import './index.less';

import Article from './views/Article';
import reducers from './reducers';

import Feature from '../connector';

export default new Feature({
  route: <Route exact path="/articles" component={Article} />,
  reducer: { article: reducers }
});
