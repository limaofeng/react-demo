import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

import { AppContainer } from './containers';
import Root from './App';
import registerServiceWorker from './registerServiceWorker';
import 'moment/locale/zh-cn'; // eslint-disable-line

moment.locale('zh-cn');

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('root')
  );
};

render(Root);

if (module.hot) {
  module.hot.accept('./App', args => {
    if (args) {
      console.log(args); // eslint-disable-line
    }
    render(Root);
  });
}

registerServiceWorker();
