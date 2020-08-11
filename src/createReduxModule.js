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
  Object.keys(reducers).forEach(key => {
    let reducer = reducers[key];
    qualifiedReducers[getQualifiedActionType(key)] = (state, action) => {
      let stateValue = state != null && state[storeKey];
      return {...state, [storeKey]: reducer(
        stateValue == null ? initialState : stateValue,
        action.payload
      )}
    }
  });

  store.registerReducers(qualifiedReducers);
  store.initializeSlice(storeKey, initialState);

  return [
    () => useSelector(storeState => storeState[storeKey]),
    mapKeys(reducers, type => payload => store.dispatch({ type: getQualifiedActionType(type), payload })),
    createVirtualStore(store, storeKey)
  ];
};
module.exports = createReduxModule;
