import { defaultParams as defaultFetchParams } from '../fetch';

const urls = {
  api: 'http://dev.zbsg.com.cn'
};

export default function request({ dispatch }) {
  return next => async action => {
    const { type, payload = null, meta = {} } = action;

    if (!type || type.constructor !== Array) return next(action);

    const [BEGIN, SUCCESS, FAILURE] = action.type;
    let [url, fetchParams] = meta.fetch;

    dispatch({
      type: BEGIN,
      payload
    });

    fetchParams = {
      ...defaultFetchParams,
      ...fetchParams
    };

    if (url.match(/^http/) === null) url = `${urls.api}${url}`;

    const response = await fetch(url, fetchParams);
    const json = await response.json();

    if (response.status >= 200 && response.status < 300) {
      return dispatch({
        type: SUCCESS,
        payload: fetchParams.method === 'delete' ? payload : json
      });
    }
    return dispatch({
      type: FAILURE,
      error: true,
      payload: fetchParams.method === 'delete' ? payload : json
    });
  };
}
