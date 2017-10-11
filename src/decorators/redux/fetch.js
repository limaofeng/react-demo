export const defaultParams = {
  mode: 'cors',
  credentials: 'include',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json; charset=utf-8'
  }
};

export function get(url, params = {}) {
  return fetch(url, {
    ...defaultParams,
    ...params,
    method: 'get'
  });
}

/**
 * HTTP GET
 * @param  {string} url
 * @return {Promise}
 */
export function read(url) {
  return fetch(url, {
    ...defaultParams,
    method: 'get'
  });
}

/**
 * HTTP POST
 * @param  {string} url
 * @param  {object} body
 * @return {Promise}
 */
export function create(url, body = {}) {
  return fetch(url, {
    ...defaultParams,
    method: 'post',
    body: JSON.stringify(body)
  });
}

/**
 * HTTP PUT
 * @param  {string} url
 * @param  {object} body
 * @return {Promise}
 */
export function update(url, body = {}) {
  return fetch(url, {
    ...defaultParams,
    method: 'put',
    body: JSON.stringify(body)
  });
}

/**
 * HTTP PATCH
 * @param  {string} url
 * @param  {object} body
 * @return {Promise}
 */
export function patch(url, body = {}) {
  return fetch(url, {
    ...defaultParams,
    method: 'PATCH',
    body: JSON.stringify(body)
  });
}

/**
 * HTTP DELETE
 * @param  {string} url
 * @return {Promise}
 */
export function destroy(url, body = {}) {
  return fetch(url, {
    ...defaultParams,
    method: 'delete',
    body: JSON.stringify(body)
  });
}
