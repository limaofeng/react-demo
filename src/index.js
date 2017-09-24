import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import './index.css';
import Root from './App';
import registerServiceWorker from './registerServiceWorker';

if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-unused-vars,react/no-deprecated
    let createClass = React.createClass;
    Object.defineProperty(React, 'createClass', {
        set: nextCreateClass => {
            createClass = nextCreateClass;
        },
    });
    const { whyDidYouUpdate } = require('why-did-you-update')
    whyDidYouUpdate(React)
}

const render = Component => {
    ReactDOM.render(<AppContainer><Component /></AppContainer>, document.getElementById('root'));
};

render(Root);

if (module.hot) {
    module.hot.accept('./App', args => {
        if (args) {
            console.log(args);
        }
        render(Root);
    })
}

registerServiceWorker();
