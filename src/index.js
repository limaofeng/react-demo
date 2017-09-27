import React from 'react';
import ReactDOM from 'react-dom';

import { AppContainer } from './containers'
import './index.less';
import Root from './App';
import registerServiceWorker from './registerServiceWorker';

const render = Component => {
  ReactDOM.render(<AppContainer><Component /></AppContainer>, document.getElementById('root'));
};

render(Root);

if (module.hot) {
  module.hot.accept('./App', args => {
    if (args) {
            console.log(args); // eslint-disable-line
    }
    render(Root);
  })
}

registerServiceWorker();
