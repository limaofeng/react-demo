/* eslint-disable prefer-rest-params */
import React from 'react';

import { merge, map, union, without, castArray } from 'lodash';

const combine = (features, extractor) => without(union(...map(features, res => castArray(extractor(res)))), undefined);

export default class {
  // eslint-disable-next-line
  constructor({ route, page, navItem, reducer }, ...features) {
    this.route = combine(arguments, arg => arg.route);
    this.page = combine(arguments, arg => arg.page);
    this.navItem = combine(arguments, arg => arg.navItem);
    this.reducer = combine(arguments, arg => arg.reducer);
    this.middleware = combine(arguments, arg => arg.middleware);
    this.afterware = combine(arguments, arg => arg.afterware);
    this.connectionParam = combine(arguments, arg => arg.connectionParam);
  }

  get routes() {
    return this.route.map((component, idx) => React.cloneElement(component, { key: String(idx + this.route.length) }));
  }

  get pages() {
    return this.page.map((component, idx) =>
      React.cloneElement(component, { key: component.key ? component.key : idx + this.page.length })
    );
  }

  get navItems() {
    return this.navItem.map((component, idx) =>
      React.cloneElement(component, {
        key: component.key ? component.key : idx + this.navItem.length
      })
    );
  }

  get reducers() {
    return merge(...this.reducer);
  }

  get middlewares() {
    return this.middleware;
  }

  get afterwares() {
    return this.afterware;
  }

  get connectionParams() {
    return this.connectionParam;
  }
}
