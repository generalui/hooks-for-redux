const React = require("react");
const { Provider: ReactReduxProvider } = require("react-redux");
const { getStore } = require("./storeRegistry");

const Provider = ({ store = getStore(), context, children }) =>
  React.createElement(ReactReduxProvider, { store, context }, children);

module.exports = Provider;
