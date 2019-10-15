const { createStore: reduxCreateStore, combineReducers } = require('redux')

// Configure the store
module.exports = (initialReducers = {}, ...args) => {
  if (typeof initialReducers !== "object") {
    console.error({initialReducers, args})
    throw new Error("initialReducers should be an object suitable to be passed to combineReducers")
  }
  const reducers = {...initialReducers, _stub_: (s) => s || 0}
  const createReducer = () => combineReducers(reducers)
  const store = reduxCreateStore(createReducer(), ...args)

  // Add a dictionary to keep track of the registered reducers
  store.reducers = reducers

  // Create an inject reducer function
  // This function adds the reducer, and creates a new combined reducer
  store.injectReducer = (key, reducer) => {
    store.reducers[key] = reducer
    store.replaceReducer(createReducer(store.reducers))
  }

  // Return the modified store
  return store
}
