const { getStore } = require("./storeRegistry");
const { useSelector } = require("react-redux");

const mapKeys = (o, f) => {
  const r = {};
  for (let k in o) r[k] = f(k);
  return r;
};

const _useSingleActonRedux = (storeKey, initialState, store) => {
  const SINGLE_ACTION = `${storeKey}-update`;
  store.injectReducer(storeKey, (state = initialState, { type, payload }) =>
    type === SINGLE_ACTION
      ? typeof payload === "function"
        ? payload(state)
        : payload
      : state
  );

  return [
    () => useSelector(storeState => storeState[storeKey]),
    payload => store.dispatch({ type: SINGLE_ACTION, payload}),
    {getState: () => store.getState()[storeKey]}
  ];
};

module.exports = (storeKey, initialState, reducers, store = getStore()) => {
  if (!reducers) return _useSingleActonRedux(storeKey, initialState, store)

  store.injectReducer(storeKey, (state = initialState, { type, payload }) =>
    reducers[type] ? reducers[type](state, payload) : state
  );

  return [
    () => useSelector(storeState => storeState[storeKey]),
    {
      getReducers: () => reducers,
      getState: () => store.getState()[storeKey],
      ...mapKeys(reducers, type => payload => store.dispatch({ type, payload }))
    }
  ];
};
