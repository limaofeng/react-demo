import { push } from 'react-router-redux';
import LogRocket from 'logrocket';
import Immutable from 'immutable';

const SAVE_USER = 'auth/SAVE_USER';
const REMOVE_USER = 'auth/REMOVE_USER';

const authstr = localStorage.getItem('auth');
const initialState = Immutable.fromJS(authstr ? JSON.parse(authstr) : null);

let timer;

export default function reducer(state = initialState, action = {}) {
  const { type, payload } = action;
  if (state) {
    LogRocket.identify(state.get('id'), {
      name: state.get('nickName'),
      email: state.get('email')
    });
  }
  switch (type) {
    case SAVE_USER:
      localStorage.setItem('auth', JSON.stringify(payload));
      return Immutable.fromJS(payload);
    case REMOVE_USER:
      clearInterval(timer);
      return null;
    default:
      return state;
  }
}

/**
 * 登录成功后保存用户
 * @param {User} user 用户对象
 */
export function save(user) {
  return dispatch => {
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
