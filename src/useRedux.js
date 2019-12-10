const { getStore } = require("./storeRegistry");
const { useState, useLayoutEffect } = require("react");
const { createVirtualStore } = require("./VirtualStore");

const mapKeys = (o, f) => {
  const r = {};
  for (let k in o) r[k] = f(k);
  return r;
};

const simpleUseRedux = (storeKey, initialState) => {
  const UPDATE_ACTION = `${storeKey}-update`;
  const [hook, dispatchers, virtualStore] = useRedux(storeKey, initialState, {
    [UPDATE_ACTION]: (state, payload) => payload
  });
  return [hook, dispatchers[UPDATE_ACTION], virtualStore];
};

const useRedux = (storeKey, initialState, reducers, store = getStore()) => {
  if (!reducers) return simpleUseRedux(storeKey, initialState);

  store.injectReducer(storeKey, (state = initialState, { type, payload }) =>
    reducers[type] ? reducers[type](state, payload) : state
  );

  const virtualStore = createVirtualStore(store, storeKey)

  return [
    () => {
      const [state, setState] = useState(virtualStore.getState())
      useLayoutEffect(() => virtualStore.subscribe(setState))
      return state;
    },
    mapKeys(reducers, type => payload => store.dispatch({ type, payload })),
    virtualStore
  ];
};
module.exports = useRedux;
