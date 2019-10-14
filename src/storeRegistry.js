import createStore from './createStore'

let store = null;
const getStore = () => store ? store : store = createStore()

const setStore = (initialStore) => {
  if (store != null)
    throw new Error("Store is already initialized. Call setStore before the first getStore.");
  if (typeof initialStore.injectReducer != "function")
    throw new Error("Store must support .injectReducer");

  return store = initialStore;
}

export {getStore, setStore}