const { getStore } = require("./storeRegistry");
const { useState, useLayoutEffect } = require("react");
const { createVirtualStore } = require("./VirtualStore");

const simpleUseRedux = (storeKey, initialState) => {
  const UPDATE_ACTION = `${storeKey}-update`;
  const [useSlice, dispatchers, virtualStore] = useRedux(storeKey, initialState, {
    [UPDATE_ACTION]: (state, payload) => payload
  });
  return [useSlice, dispatchers[UPDATE_ACTION], virtualStore];
};

const useRedux = (storeKey, initialState, reducers, store = getStore()) => {
  if (!reducers) return simpleUseRedux(storeKey, initialState);

  store.injectReducer(storeKey, (state = initialState, { type, payload }) =>
    reducers[type] ? reducers[type](state, payload) : state
  );

  const useSlice = () => {
    const [state, setState] = useState(() => virtualStore.getState());
    useLayoutEffect(() => virtualStore.subscribe((v) => setState(() => v)), [setState]);
    return state;
  };

  const dispatchers = {};
  for (let type in reducers)
    dispatchers[type] = payload => store.dispatch({ type, payload });

  const virtualStore = createVirtualStore(store, storeKey)

  return [
    useSlice,
    dispatchers,
    virtualStore
  ];
};
module.exports = useRedux;