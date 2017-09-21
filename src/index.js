import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import './index.css';
import Root from './App';
import registerServiceWorker from './registerServiceWorker';

const render = Component => {
    ReactDOM.render(<AppContainer><Component /></AppContainer>, document.getElementById('root'));
};

render(Root);

if (module.hot) {
    module.hot.accept('./App', () => {
        console.log('.....');
        render(Root);
    })
}

registerServiceWorker();
