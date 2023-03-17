const { createStore: reduxCreateStore, combineReducers } = require('redux')

const getRootReducerSlices = (state, reducers, initialReducer) => {
  const initialSlices = initialReducer ? initialReducer({}, '') : {}
  const initialKeys = Object.keys(initialSlices)
  const knownKeys = Object.keys(reducers)
  const slices = {
    known: {},
    unknown: {}
  }

  for (const key of Object.keys(state)) {
    if (knownKeys.includes(key)) {
      slices.known[key] = state[key]
    } else {
      slices.unknown[key] = state[key]
    }

    if (initialKeys.includes(key)) {
      slices.unknown[key] = state[key]
    }
  }
   
  return slices
}

module.exports = (initialReducer = {}, ...args) => {
  let reducers
  let rootReducer
  
  if (typeof initialReducer === "object") {
    reducers = {...initialReducer, _stub_: (s) => s || 0}
  } else if (typeof initialReducer === "function") {
    reducers = {_stub_: (s) => s || 0}
    if (initialReducer.name === 'combination') {
      rootReducer = (state = {}, action) => {
        const slices = getRootReducerSlices(state, reducers, initialReducer)
        const intermediateState = combinedReducer(slices.known, action)
        for (const key of Object.keys(intermediateState)) {
          if (slices.unknown.hasOwnProperty(key)) {
            slices.unknown[key] = intermediateState[key]
          }
        }
        return {...intermediateState, ...initialReducer(slices.unknown, action)}
      }
    } else {
      rootReducer = (state = {}, action) => {
        const slices = getRootReducerSlices(state, reducers)
        const intermediateState = combinedReducer(slices.known, action)
        return initialReducer({...state, ...intermediateState}, action)
      }
    }
  } else {
    console.error({initialReducer, args})
    throw new Error("initialReducer should be an object suitable to be passed to combineReducers or a reducing function (\"uncombined\")")
  }

  let combinedReducer = combineReducers(reducers)
  const store = reduxCreateStore(rootReducer || combinedReducer)
  store.injectReducer = (key, reducer) => {
    if (reducers[key]) console.warn(`injectReducer: replacing reducer for key '${key}'`)
    reducers[key] = reducer
    combinedReducer = combineReducers(reducers)
    store.replaceReducer(rootReducer || combinedReducer)
  }

  return store
}
