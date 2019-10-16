const React = require('react')
const {Provider} = require('react-redux');
const {getStore} = require('./storeRegistry');

module.exports = (props) =>
  React.createElement(Provider, {
    store: getStore()
  }, props.children);