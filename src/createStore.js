const { createStore: reduxCreateStore, combineReducers } = require('redux')

const getStateSlices = (state, reducerKeys, initialKeys = []) => {
  const slices = { known: {}, unknown: {} }

  Object.keys(state).forEach((key) => {
    if (reducerKeys.includes(key)) {
      slices.known[key] = state[key]
    } else {
      slices.unknown[key] = state[key]
    }

    if (initialKeys.includes(key)) {
      slices.unknown[key] = state[key]
    }
  })
   
  return slices
}

module.exports = (initialReducer = {}, ...args) => {
  let store
  let reducers
  
  // Passing an object of reducers is preferable for performances
  if (typeof initialReducer === "object") {
    reducers = {...initialReducer, _stub_: (s) => s || 0}
    store = reduxCreateStore(combineReducers(reducers))
    store.injectReducer = (key, reducer) => {
      if (reducers[key]) console.warn(`injectReducer: replacing reducer for key '${key}'`)
      reducers[key] = reducer
      store.replaceReducer(combineReducers(reducers))
    }
  } 
  // Support for default redux API (single or combined reducer)
  else if (typeof initialReducer === "function") {
    const initialKeys = Object.keys(initialReducer(undefined, '') || {})
    reducers = {_stub_: (s) => s || 0}
    let reducerKeys = Object.keys(reducers)
    let combinedReducer = combineReducers(reducers)
    let rootReducer

    // Combined reducer
    if (initialReducer.name === 'combination') {
      rootReducer = (state = {}, action) => {
        const slices = getStateSlices(state, reducerKeys, initialKeys)
        const intermediate = combinedReducer(slices.known, action)
        Object.keys(intermediate).forEach((key) => {
          if (slices.unknown.hasOwnProperty(key)) {
            slices.unknown[key] = intermediate[key]
          }
        })
        return {intermediate, ...initialReducer(slices.unknown, action)}
      }
    } 
    // Single reducer
    else {
      rootReducer = (state = {}, action) => {
        const slices = getStateSlices(state, reducerKeys, initialKeys)
        return initialReducer({...state, ...combinedReducer(slices.known, action)}, action)
      }
    }

    store = reduxCreateStore(rootReducer)
    store.injectReducer = (key, reducer) => {
      if (reducers[key]) console.warn(`injectReducer: replacing reducer for key '${key}'`)
      reducers[key] = reducer
      reducerKeys = Object.keys(reducers)
      combinedReducer = combineReducers(reducers)
      store.replaceReducer(rootReducer)
    }
  } else {
    console.error({initialReducer, args})
    throw new Error("initialReducer should be an object suitable to be passed to combineReducers or a reducing function (\"uncombined\")")
  }

  return store
}
