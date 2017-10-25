import Immutable from 'immutable';

const CHANGE_STATUS = 'ui/CHANGE_STATUS';

const initialState = Immutable.fromJS({ status: 'loading', loading: true });

const changeStatus = (state, status) => {
  switch (status) {
    case 'loading':
      state.set('status', 'loading');
      state.set('loading', true);
      state.set('locking', false);
      return state;
    case 'locking':
      state.set('status', 'loading');
      state.set('loading', false);
      state.set('locking', true);
      return state;
    case 'none':
      state.set('status', 'none');
      state.set('loading', false);
      state.set('locking', false);
      return state;
    default:
      return state;
  }
};

export default function reducer(state = initialState, action = {}) {
  const { type, payload } = action;
  if (type === CHANGE_STATUS) {
    changeStatus(state, payload);
  }
  return state;
}

export function load() {
  return dispatch => {
    dispatch({
      type: CHANGE_STATUS,
      payload: 'loading'
    });
    return new Promise(resolve => {
      resolve('loading');
    });
  };
}

export function unload() {
  return dispatch => {
    dispatch({
      type: CHANGE_STATUS,
      payload: 'none'
    });
    return new Promise(resolve => {
      resolve('none');
    });
  };
}

export function lock() {
  return dispatch => {
    dispatch({
      type: CHANGE_STATUS,
      payload: 'locking'
    });
    return new Promise(resolve => {
      resolve('locking');
    });
  };
}

export function unlock() {
  return dispatch => {
    dispatch({
      type: CHANGE_STATUS,
      payload: 'none'
    });
    return new Promise(resolve => {
      resolve('none');
    });
  };
}
