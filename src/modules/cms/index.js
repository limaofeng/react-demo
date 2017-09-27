import React from 'react';
import { Route } from 'react-router-dom';

import './index.less';

import Articles from './views/Article';
import ArticleEdit from './views/ArticleEdit';

import reducers from './reducers';

import Feature from '../connector';

export default new Feature({
  page: [<Route exact path="/articles" component={Articles} />, <Route exact path="/articles/:id" component={ArticleEdit} />],
  reducer: { article: reducers }
});
