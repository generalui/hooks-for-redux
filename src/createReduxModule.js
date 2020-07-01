const { getStore } = require("./storeRegistry");
const { useSelector } = require("react-redux");
const { createVirtualStore } = require("./VirtualStore");

const mapKeys = (o, f) => {
  const r = {};
  for (let k in o) r[k] = f(k);
  return r;
};

const createSimpleReduxModule = (storeKey, initialState) => {
  const [hook, dispatchers, virtualStore] = createReduxModule(storeKey, initialState, {
    update: (state, payload) => payload
  });
  return [hook, dispatchers.update, virtualStore];
};

const createReduxModule = (storeKey, initialState, reducers, store = getStore()) => {
  if (!reducers) return createSimpleReduxModule(storeKey, initialState);

  let getQualifiedActionType = (type) => `${storeKey}-${type}`;
  let qualifiedReducers = {}
  Object.keys(reducers).map(key => { return qualifiedReducers[getQualifiedActionType(key)] = reducers[key] });

  store.injectReducer(storeKey, (state = initialState, { type, payload }) =>
    qualifiedReducers[type] ? qualifiedReducers[type](state, payload) : state
  );

  return [
    () => useSelector(storeState => storeState[storeKey]),
    mapKeys(reducers, type => payload => store.dispatch({ type: getQualifiedActionType(type), payload })),
    createVirtualStore(store, storeKey)
  ];
};
module.exports = createReduxModule;
