import {
  clearLocalStorageCounter,
  decrement,
  increment,
  reset,
  useCounter,
} from "./counter";
import "./App.css";

function App() {
  return (
    <div className="App">
      <h1>Persist data in Local Storage</h1>
      <h3>Counter: {useCounter()}</h3>
      <div>
        <button onClick={decrement}>-1</button>
        <button onClick={reset}>Reset</button>
        <button onClick={increment}>+1</button>
      </div>
      <div>
        <button
          onClick={() => {
            reset();
            clearLocalStorageCounter();
          }}
        >
          Clear Local Storage
        </button>
      </div>
    </div>
  );
}

export default App;
