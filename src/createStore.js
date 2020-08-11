const { createStore: reduxCreateStore, combineReducers } = require('redux')

const noop = (a) => a;

module.exports = (passedInReducer = noop, ...args) => {
  if (typeof passedInReducer !== "function") {
    console.error({passedInReducer, args})
    throw new Error("passedInReducer should be a function")
  }

  const reducers = {
    __initialize: (state, action) => ({...state, ...action.payload})
  }

  const reducer = (state, action) => {
    state = passedInReducer(state);
    let reducer = reducers[action != null ? action.type : undefined];
    if (reducer)  return reducer(state, action);
    else          return state;
  }

  const store = reduxCreateStore(reducer, ...args)

  store.getReducer = () => reducer;
  store.__redux_replaceReducer = store.replaceReducer
  store.replaceReducer = function (r) {
    return this.__redux_replaceReducer(reducer = r);
  }

  store.initializeSlice = (sliceKey, initialValue) =>
    store.dispatch({ type: "__initialize", payload: {[sliceKey]: initialValue} })

  store.registerReducers = (newReducers) => {
    for (let key in newReducers) {
      reducers[key] = newReducers[key];
    }
  }

  return store
}
