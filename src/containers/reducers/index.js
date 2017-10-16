const CHANGE_STATUS = 'ui/CHANGE_STATUS';

const initialState = { status: 'loading', loading: true };

const changeStatus = status => {
  switch (status) {
    case 'loading':
      return { status: 'loading', loading: true, locking: false };
    case 'locking':
      return { status: 'locking', loading: false, locking: true };
    case 'none':
      return { status: 'none', loading: false, locking: false };
    default:
      return {};
  }
};

export default function reducer(state = initialState, action = {}) {
  const { type, payload } = action;
  switch (type) {
    case CHANGE_STATUS:
      return { ...state, ...changeStatus(payload) };
    default:
      return state;
  }
}

export function load() {
  return dispatch => {
    dispatch({
      type: CHANGE_STATUS,
      payload: 'loading'
    });
    return new Promise(resolve => {
      resolve(status);
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
      resolve(status);
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
      resolve(status);
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
      resolve(status);
    });
  };
}
