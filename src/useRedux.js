const { getStore } = require("./storeRegistry");
const createReduxModule = require('./createReduxModule');

let warnedOnce = false;
const useRedux = (storeKey, initialState, reducers, store = getStore()) => {
  if (!warnedOnce) {
    console.warn("DEPRECATED: hooks-for-redux - `useRedux` is deprecated. Use `createReduxModule` instead.\n(same API, new name that doesn't erroneously trigger the React warning: https://reactjs.org/warnings/invalid-hook-call-warning.html)");
    warnedOnce = true;
  }
  return createReduxModule(storeKey, initialState, reducers, store);
};
module.exports = useRedux;
