const createStore = require('./createStore');

let store = null;
module.exports = {
  getStore: () => store ? store : store = createStore(),

  setStore: (initialStore) => {
    if (store != null)
      throw new Error("Store is already initialized. Call setStore before the first getStore.");
    if (typeof initialStore.injectReducer != "function")
      throw new Error("Store must support .injectReducer");

    return store = initialStore;
  }
}
