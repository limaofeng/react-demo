import { push } from 'react-router-redux';

const SAVE_USER = 'auth/SAVE_USER';
const REMOVE_USER = 'auth/REMOVE_USER';

// const authstr = localStorage.getItem('auth');
const initialState = {
  user: null,
  isAuthenticated: false,
  scope: [],
  token: null
};

export default function reducer(state = initialState, action = {}) {
  const { type, payload } = action;
  switch (type) {
    case SAVE_USER:
      localStorage.setItem('auth', JSON.stringify(payload));
      return { ...state, user: payload, isAuthenticated: true };
    case REMOVE_USER:
      return { ...state, user: null, isAuthenticated: false };
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
