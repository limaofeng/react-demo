import { isEqual as _isEqual, clone, uniq, zipObject } from 'lodash';// isEqual as _isEqual, 

export const diff = (lvalue, rvalue) => {
  if (_isEqual(lvalue, rvalue)) {
    return {};
  }
  const keys = uniq(Object.keys(lvalue).concat(Object.keys(rvalue))).filter(key => !_isEqual(lvalue[key], rvalue[key]));
  const values = keys.map(key => rvalue[key]);
  return zipObject(keys, values);
};


export const lazy = (ovalue, { isEqual = _isEqual, onlyDiff = false, delay = 1500 }) => {
  let lvalue = clone(ovalue);
  let lazy;
  return value => new Promise(resolve => {
    clearTimeout(lazy);
    if (isEqual(lvalue, value)) {
      return;
    }
    lazy = setTimeout(() => {
      console.log(lvalue, value, isEqual(lvalue, value));
      console.log(`执行更新 ${JSON.stringify(value)}`);
      resolve(onlyDiff ? diff(lvalue, value) : value);
      lvalue = clone(value);
    }, delay);
  });
};

export default { lazy };
