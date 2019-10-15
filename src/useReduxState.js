const {getStore} = require('./storeRegistry')
const {useSelector} = require('react-redux')

module.exports = (storeKey, initialState) => {
  const store = getStore()
  const useSubscription = () => useSelector(storeState => storeState[storeKey])
  const update = (updateState) => store.dispatch({type: storeKey, updateState})

  store.injectReducer(storeKey, (state = initialState, {type, updateState}) => {
    if (type === storeKey) {
      if (typeof updateState === "function")
        state = updateState(state);
      else
        state = updateState;

      if (state == null) {
        console.error({reduce:{state, action:{type, updateState}}});
        throw new Error(`updateState for ${storeKey} should not return ${state}`)
      }
    }
    return state;
  })

  return [useSubscription, update]
}