/**
 * Logs previous and current state for every action call
 * @param getState
 * @returns {Function}
 */
export default function logger({ getState }) {
  return next => action => {
    // eslint-disable-next-line
    console.log('dispatching', action);
    const result = next(action);
    // eslint-disable-next-line
    console.log('next state', getState());
    return result;
  };
}
