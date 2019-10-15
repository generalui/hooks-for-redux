module.exports = {
  ...require('./storeRegistry'),
  createStore: require("./createStore"),
  useReduxState: require("./useReduxState")
}
