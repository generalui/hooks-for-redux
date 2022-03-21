const { createStore: reduxCreateStore, combineReducers } = require('redux')

module.exports = (initialReducer = {}, ...args) => {
  let reducers
  let combinedReducer
  let rootReducer

  if (typeof initialReducer !== "object" && typeof initialReducer !== "function") {
    console.error({initialReducer, args})
    throw new Error("initialReducer should be a reducing function (\"uncombined\") or an object suitable to be passed to combineReducers")
  } else if (typeof initialReducer === "function") {
    if (initialReducer.name === "combination") {
      console.error({initialReducer, args})
      throw new Error("initialReducer should be a reducing function (\"uncombined\") or an object suitable to be passed to combineReducers")
    } else {
      reducers = {_stub_: (s) => s || 0}
      rootReducer = (state, action) => {
        const intermediateState = combinedReducer(state, action)
        return initialReducer(intermediateState, action)
      }
    }
  } else {
    reducers = {...initialReducer, _stub_: (s) => s || 0}
  }

  combinedReducer = combineReducers(reducers);
  const store = reduxCreateStore(rootReducer || combinedReducer, ...args)

  store.injectReducer = (key, reducer) => {
    if (reducers[key]) console.warn(`injectReducer: replacing reducer for key '${key}'`);
    reducers[key] = reducer
    combinedReducer = combineReducers(reducers);
    store.replaceReducer(rootReducer || combinedReducer)
  }

  return store
}
