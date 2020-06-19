import React from "react";
import ReactDOM from "react-dom";
import { applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { Provider, createReduxModule, createStore, setStore } from "hooks-for-redux";

// example middleware
const logDispatch = store => next => action => {
  console.log("dispatching", action);
  return next(action);
};

// store.js
export default setStore(createStore({}, composeWithDevTools(applyMiddleware(logDispatch))));

// toggleState.js
const [useToggle, { toggleSwitch }] = createReduxModule("toggle", false, {
  toggleSwitch: state => !state
});

// Toggle.js
const Toggle = () => {
  const toggle = useToggle();
  return (
    <div>
      <div>{JSON.stringify(toggle)}</div>
      <input type="checkbox" value={toggle} onChange={() => toggleSwitch()} />
    </div>
  );
};

// index.js
const App = () => (
  <Provider>
    <Toggle />
  </Provider>
);

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
