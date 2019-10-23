const {getStore} = require('./storeRegistry')
const {useSelector} = require('react-redux')

const mapKeys = (o, f) => {
  const r = {}
  for(let k in o) r[k] = f(k);
  return r;
}

module.exports = (storeKey, initialState, reducers, store = getStore()) => {
  store.injectReducer(storeKey, (state = initialState, {type, payload}) =>
    reducers[type] ? reducers[type](state, payload) : state
  )

  return [
    () => useSelector(storeState => storeState[storeKey]),
    {
      getReducers: () => reducers,
      getState: () => store.getState()[storeKey],
      ...mapKeys(reducers, (type) => (payload) => store.dispatch({type, payload}))
    }
  ]
}
