const { createStore: reduxCreateStore, combineReducers } = require('redux')

module.exports = (initialReducers = {}, ...args) => {
  if (typeof initialReducers !== "object") {
    console.error({initialReducers, args})
    throw new Error("initialReducers should be an object suitable to be passed to combineReducers")
  }

  const reducers = {...initialReducers, _stub_: (s) => s || 0}
  const store = reduxCreateStore(combineReducers(reducers), ...args)

  store.injectReducer = (key, reducer) => {
    if (reducers[key]) console.warn(`injectReducer: replacing reducer for key '${key}'`);
    reducers[key] = reducer
    store.replaceReducer(combineReducers(reducers))
  }

  return store
}
