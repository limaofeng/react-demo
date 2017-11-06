import Immutable from 'immutable';

const CHANGE_STATUS = 'ui/CHANGE_STATUS';

const initialState = Immutable.fromJS({ status: 'loading', loading: true, locking: false });

const changeStatus = (state, status) => {
  switch (status) {
    case 'loading':
      return state
        .set('status', 'loading')
        .set('loading', true)
        .set('locking', false);
    case 'locking':
      return state
        .set('status', 'loading')
        .set('loading', false)
        .set('locking', true);
    case 'none':
      return state
        .set('status', 'none')
        .set('loading', false)
        .set('locking', false);
    default:
      return state;
  }
};

export default function reducer(state = initialState, action = {}) {
  const { type, payload } = action;
  if (type === CHANGE_STATUS) {
    return changeStatus(state, payload);
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
