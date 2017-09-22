import Main from './views/Main';
import Home from './views/Home';
import Login from './views/Auth';

export const routes = () => [
    {
        path: '/login',
        exact: true,
        access: 'Public',
        component: Login
    },
    {
        path: '/',
        component: Main,
        routes: [
            {
                path: '/',
                exact: true,
                component: Home
            }]
    }
];

export default routes;
