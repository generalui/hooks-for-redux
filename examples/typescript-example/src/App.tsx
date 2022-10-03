import React from "react";
import logo from "./logo.svg";
import "./App.css";
import * as MyModel from "./MyModel";

function App() {
  const myModel = MyModel.use(); // myModel should be MyModelState
  const isOn = MyModel.use(({ isOn }) => isOn); // isOn should be boolean

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
