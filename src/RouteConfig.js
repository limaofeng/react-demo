import MainContainer from './containers/MainContainer';
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
    component: MainContainer,
    routes: [
      {
        path: '/',
        exact: true,
        component: Home
      }]
  }
];

export default routes;
