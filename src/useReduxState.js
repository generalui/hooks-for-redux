const {getStore} = require('./storeRegistry')
const {useSelector} = require('react-redux')

let warnedAlready = false;

module.exports = (storeKey, initialState) => {
  if (!warnedAlready) {
    console.warn("DEPRECATED: `useReduxState` USE: `useRedux`");
    warnedAlready = true;
  }
  const store = getStore()
  const updateActionType = `${storeKey}Update`
  const createDispatcher = (type) => (payload) => store.dispatch({type, payload})

  let reducers = {
    [updateActionType]: (state, payload) => {
      if (typeof payload === "function")
            return payload(state);
      else  return payload;
    }
  }

  store.injectReducer(storeKey, (state = initialState, {type, payload}) =>
    reducers[type] ? reducers[type](state, payload) : state
  )

  const useSubscription = () => useSelector(storeState => storeState[storeKey])
  const update = createDispatcher(updateActionType)
  const addReducers = (newReducers) => {
    reducers = {...reducers, ...newReducers}
    let dispatchers = {}
    for (let type in newReducers) {
      dispatchers[type] = createDispatcher(type)
    }
    return dispatchers
  }

  return [useSubscription, update, addReducers, {
    getReducers() {return reducers;},
    getState() {return store.getState()[storeKey];},
  }]
}