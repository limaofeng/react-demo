import NProgress from 'nprogress';

import 'nprogress/nprogress.css';

NProgress.configure({ easing: 'ease', speed: 500 });

export const start = {
  applyMiddleware(req, next) {
    NProgress.start();
    next();
  }
};

export const done = {
  applyAfterware(req, next) {
    NProgress.done();
    next();
  }
};

export default { start, done };
