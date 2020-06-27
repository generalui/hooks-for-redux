const { getStore } = require("./storeRegistry");
const { useSelector } = require("react-redux");
const { createVirtualStore } = require("./VirtualStore");

const mapKeys = (o, f) => {
  const r = {};
  o.forEach(k => r[k] = f(k));
  return r;
};

const renameReducerKeys = (reducers, storeKeygenerator) => {
  let o = {}
  for(const k in reducers) o[storeKeygenerator(k)] = reducers[k];
  return o;
}

const createSimpleReduxModule = (storeKey, initialState) => {
  const UPDATE_ACTION = 'update';
  const [hook, dispatchers, virtualStore] = createReduxModule(storeKey, initialState, {
    [UPDATE_ACTION]: (_state, payload) => payload
  });
  return [hook, dispatchers[UPDATE_ACTION], virtualStore];
};

const createReduxModule = (storeKey, initialState, reducers, store = getStore()) => {
  if (!reducers) return createSimpleReduxModule(storeKey, initialState);

  const storeKeygenerator = (key) => `${storeKey}#${key}`

  let originalReducerKeys = [];
  for(let k in reducers) {originalReducerKeys.push(k)}

  reducers = renameReducerKeys(reducers, storeKeygenerator)
  store.injectReducer(storeKey, (state = initialState, { type, payload }) => {
    return reducers[type] ? reducers[type](state, payload) : state
  });

  return [
    () => useSelector(storeState => storeState[storeKey]),
    mapKeys(originalReducerKeys, type => payload => store.dispatch({ type: storeKeygenerator(type), payload })),
    createVirtualStore(store, storeKey)
  ];
};
module.exports = createReduxModule;
