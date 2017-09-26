const CHANGE_STATUS = 'ui/CHANGE_STATUS';

const initialState = { status: 'loading', loading: true };

const changeStatus = status => {
    switch (status) {
    case 'loading':
        return { status: 'loading', loading: true };
    case 'none':
        return { status: 'none', loading: false };
    default:
        return {}
    }
}

export default function reducer(state = initialState, action = {}) {
    const { type, payload } = action;
    switch (type) {
    case CHANGE_STATUS:
        return { ...state, ...changeStatus(payload) }
    default:
        return state;
    }
}

/**
 * 加载中
 */
export function loading() {
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

export function loadOver() {
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
