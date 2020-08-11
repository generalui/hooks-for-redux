const {getStore, setStore} = require('./storeRegistry');

module.exports = {
  getStore,
  setStore,
  createStore:        require("./createStore"),
  Provider:           require("./Provider"),
  createReduxModule:  require("./createReduxModule")
}
