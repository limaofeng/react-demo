import LogRocket from 'logrocket';

if (process.env.NODE_ENV === 'production') {
    LogRocket.init('b62az1/react-demo');
    require('logrocket-react')(LogRocket);
}
