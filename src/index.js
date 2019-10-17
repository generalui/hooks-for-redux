const {getStore, setStore} = require('./storeRegistry');

module.exports = {
  getStore,
  setStore,
  createStore:    require("./createStore"),
  useReduxState:  require("./useReduxState"),
  Provider:       require("./Provider")
}
