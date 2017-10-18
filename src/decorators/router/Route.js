/* eslint no-useless-escape: 0 */
import React from 'react';
import { Route as OriginalRoute } from 'react-router-dom';

import Bundle from './Bundle';

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

const lazyLoadComponent = lazyModule =>
  lazyModule.lazyRouteComponent ||
  (props => <Bundle load={lazyModule}>{Container => <Container {...props} />}</Bundle>);

export default class Route extends OriginalRoute {
  render() {
    const { component } = this.props;
    return (
      <OriginalRoute
        {...this.props}
        component={isLazyLoadComponent(component) ? lazyLoadComponent(component) : component}
      />
    );
  }
}
