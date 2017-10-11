import React from 'react';
import { Route } from 'react-router-dom';

import './index.less';

import Articles from './views/Article';
import ArticleEdit from './views/ArticleEdit';

import reducers from './reducers';

import Feature from '../connector';

export default new Feature({
  navItem: [
    <Route path="/articles" component={() => <li className="active">文章维护</li>} />,
    <Route path="/articles/:id" component={() => <li className="active">文章详情</li>} />
  ],
  page: [
    <Route exact path="/articles" component={Articles} />,
    <Route exact path="/articles/:id" component={ArticleEdit} />
  ],
  reducer: { article: reducers }
});
