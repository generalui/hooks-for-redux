const createStore = require('./createStore');

let store = null;
module.exports = {
  getStore: () => store ? store : store = createStore(),

  setStore: (initialStore) => {
    if (store != null) {
      console.warn("Store is already initialized. Call setStore before the first getStore. This call will be ignored.");
      return;
    }
    if (typeof initialStore.injectReducer != "function")
      throw new Error("Store must support .injectReducer");

    return store = initialStore;
  }
}
