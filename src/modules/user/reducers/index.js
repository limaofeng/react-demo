import { push } from 'react-router-redux';
import LogRocket from 'logrocket';

const SAVE_USER = 'auth/SAVE_USER';
const REMOVE_USER = 'auth/REMOVE_USER';

const initialState = localStorage.getItem('auth');

let timer;

export default function reducer(state = initialState, action = {}) {
  const { type, payload } = action;
  let newstate = state;
  if (typeof state === 'string') {
    newstate = JSON.parse(state);
  }
  if (newstate) {
    LogRocket.identify(newstate.id, {
      name: newstate.nickName,
      email: newstate.email
    });
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
    localStorage.setItem('auth', JSON.stringify(user));
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
    localStorage.removeItem('auth');
    dispatch({
      type: REMOVE_USER,
      payload: null
    });
    return new Promise(resolve => {
      resolve(dispatch(push('/login')));
    });
  };
}
