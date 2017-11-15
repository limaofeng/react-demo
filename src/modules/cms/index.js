import React from 'react';
import { connector as Feature, Route } from 'walkuere';

import './index.less';

import Articles from './views/Article';
import ArticleEdit from './views/ArticleEdit';

import reducers from './reducers';

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
