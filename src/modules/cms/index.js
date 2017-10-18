import React from 'react';
import { Route } from 'react-router-dom';

import './index.less';

import Articles from './views/Article';
import ArticleEdit from './views/ArticleEdit';

import reducers from './reducers';

import Feature from '../connector';

import Bundle from '../../decorators/router/Bundle';
/* eslint no-useless-escape: 0 */
function argumentNames(fn) {
  const names = fn
    .toString()
    .match(/^[\s\(]*function[^(]*\(([^\)]*)\)/)[1]
    .replace(/\s+/g, '')
    .split(',');
  return names.length === 1 && !names[0] ? [] : names;
}

function isLazyLoadComponent(fn) {
  const names = argumentNames(fn);
  return names.length === 1 && names[0] === 'cb';
}

console.log(isLazyLoadComponent);

const lazyLoadComponent = lazyModule =>
  lazyModule.lazyRouteComponent ||
  (props => <Bundle load={lazyModule}>{Container => <Container {...props} />}</Bundle>);

export default new Feature({
  navItem: [
    <Route path="/articles" component={() => <li className="active">文章维护</li>} />,
    <Route path="/articles/:id" component={() => <li className="active">文章详情</li>} />
  ],
  page: [
    <Route exact path="/articles" component={lazyLoadComponent(Articles)} />,
    <Route exact path="/articles/:id" component={lazyLoadComponent(ArticleEdit)} />
  ],
  reducer: { article: reducers }
});
