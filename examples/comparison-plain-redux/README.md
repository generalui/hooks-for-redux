# Comparison-Vanilla-Redux

This example is one of two comparing hooks-for-redux with vanilla redux in a very simple app.

## Compare

* comparison-vanilla-redux
* comparison-hooks-for-redux

## JavaScript Source

With vanilla redux, you have to write dramatically **more** code. Here's all the JavaScript source in one place:

```javascript
// actions.js
const SET_GREETING = 'SET_GREETING';
const RESET_GREETING = 'RESET_GREETING';
export {
  SET_GREETING,
  RESET_GREETING
}

// greetingReducer.js
import {SET_GREETING, RESET_GREETING} from './actions'
const DEFAULT_GREETING = "hello, vanilla redux";

const greeting = (state = DEFAULT_GREETING, action) => {
  switch (action.type) {
    case SET_GREETING:
      return action.payload;
    case RESET_GREETING:
      return DEFAULT_GREETING;
    default:
      return state;
  }
}
export default greeting

// store.js
import {createStore, combineReducers} from 'redux'
import greeting from './greetingReducer'

const store = createStore(combineReducers({
  greeting
}));

export default store

// App.js
import React from 'react'
import {useSelector} from 'react-redux'
import store from './store'
import {SET_GREETING, RESET_GREETING} from './actions'

const resetGreeting = () => store.dispatch({
  type: RESET_GREETING
})

const setGreeting = (greeting) => store.dispatch({
  type: SET_GREETING,
  payload: greeting
})

const App = () =>
  <div>
    <h1>{ useSelector(({greeting}) => greeting) }</h1>
    <a href="#" onClick={() => setGreeting("こんにちは, バニラ redux")}>
      japanese
    </a> <a href="#" onClick={() => resetGreeting()}>reset</a>
  </div>

export default App

// index.js
import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'

import './index.css'
import App from './App'
import store from './store'

ReactDOM.render(
  <Provider {...{store}}><App/></Provider>,
  document.getElementById('root')
);
```
