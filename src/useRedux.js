const { getStore } = require("./storeRegistry");
const { useSelector } = require("react-redux");
const { createVirtualStore } = require("./virtualStore");

const mapKeys = (o, f) => {
  const r = {};
  for (let k in o) r[k] = f(k);
  return r;
};

const simpleUseState = (storeKey, initialState) => {
  const UPDATE_ACTION = `${storeKey}-update`;
  const [hook, dispatchers, virtualStore] = useState(storeKey, initialState, {
    [UPDATE_ACTION]: (state, payload) => payload
  });
  return [hook, dispatchers[UPDATE_ACTION], virtualStore];
};

const useState = (storeKey, initialState, reducers, store = getStore()) => {
  if (!reducers) return simpleUseState(storeKey, initialState);

  store.injectReducer(storeKey, (state = initialState, { type, payload }) =>
    reducers[type] ? reducers[type](state, payload) : state
  );

  return [
    () => useSelector(storeState => storeState[storeKey]),
    mapKeys(reducers, type => payload => store.dispatch({ type, payload })),
    createVirtualStore(store, storeKey)
  ];
};

module.exports = useState;
