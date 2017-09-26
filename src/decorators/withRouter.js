import React from 'react';

import { ConnectedRouter, routerReducer as OriginRouterReducer, routerMiddleware as OriginRouterMiddleware } from 'react-router-redux';
import { Switch } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';

import { RouteWithSubRoutes } from './router';

function parseQueryString(url) {
    const query = url.indexOf('?') > -1 ? url.replace(/^[^\\?]{0,}\??/, '') : url;
    const data = {};
    if (!query) {
        return data;
    }
    const pairs = query.split(/[;&]/);
    for (let i = 0; i < pairs.length; i++) {
        const KeyVal = pairs[i].split('=');
        if (!KeyVal || KeyVal.length !== 2) {
            continue; // eslint-disable-line
        }
        const key = decodeURIComponent(KeyVal[0]);// decodeURIComponent
        const val = decodeURIComponent(KeyVal[1]);// unescape
        if (data[key]) {
            if (Object.prototype.toString.call(data[key]) !== '[object Array]') {
                data[key] = [data[key]];
            }
            data[key].push(val);
        } else {
            data[key] = val;
        }
    }
    return data;
}

// 解决 history 3.x 升级到 4.x 后， location 中不存在 query 的问题。避免修改原代码的兼容解决方案
export const compatibleRouterMiddleware = () => () => next => action => {
    const { type, payload } = action;
    if (type === '@@router/LOCATION_CHANGE') {
        payload.query = parseQueryString(payload.search);
        return next({ ...action });
    }
    return next(action);
}

export const routerMiddleware = () => OriginRouterMiddleware();

export const routerReducer = OriginRouterReducer;

export const history = createHistory();

export default function withRouter({ routes }) {
    return WrappedComponent => props => (<ConnectedRouter history={history}>
        <WrappedComponent {...props}>
            <Switch>
                {routes.map((route, index) => (
                    <RouteWithSubRoutes key={index} {...route} />
                ))}
            </Switch>
        </WrappedComponent>
    </ConnectedRouter>);
}
