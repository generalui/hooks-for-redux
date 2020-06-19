import React from "react";
import ReactDOM from "react-dom";
import { applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";
import { Provider, createReduxModule, createStore, setStore } from "hooks-for-redux";

// store.js
const store = setStore(
  createStore({}, composeWithDevTools(applyMiddleware(thunkMiddleware)))
);

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
      <input type="checkbox" value={toggle} onChange={toggleSwitch} />
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
