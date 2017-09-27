import { push } from 'react-router-redux';

const SAVE_USER = 'auth/SAVE_USER';
const REMOVE_USER = 'auth/REMOVE_USER';
// import LogRocket from 'logrocket';

const initialState = localStorage.getItem('zbsg_admin_auth');

let timer;

export default function reducer(state = initialState, action = {}) {
  const { type, payload } = action;
  let newstate = state;
  if (typeof state === 'string') {
    newstate = JSON.parse(state);
  }
  if (newstate && process.env.NODE_ENV === 'production') {
    /* LogRocket.identify('b62az1/shzbsg-admin', {
            name: newstate.nickName,
            email: newstate.email,

            // Add your own custom user variables here, ie:
            subscriptionType: 'pro'
        }); */
  }
  switch (type) {
    case SAVE_USER:
      return { ...payload };
    case REMOVE_USER:
      clearInterval(timer);
      return null;
    default:
      return newstate;
  }
}

/**
 * 登录成功后保存用户
 * @param {User} user 用户对象
 */
export function save(user) {
  return dispatch => {
    localStorage.setItem('zbsg_admin_auth', JSON.stringify(user));
    dispatch({
      type: SAVE_USER,
      payload: user
    });
  };
}

/**
 * 用户退出
 */
export function logout() {
  return dispatch => {
    localStorage.removeItem('zbsg_admin_auth');
    dispatch({
      type: REMOVE_USER,
      payload: null
    });
    return new Promise(resolve => {
      resolve(dispatch(push('/login')));
    });
  };
}
