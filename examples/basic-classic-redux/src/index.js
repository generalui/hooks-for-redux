import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import {useSelector, Provider} from 'react-redux';
import {createStore, combineReducers } from 'redux';

// actions.js
const SET_GREETING = 'SET_GREETING';
const RESET_GREETING = 'RESET_GREETING';

// reducers/greeting.js
const DEFAULT_GREETING = "hello";

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

// store.js
const store = createStore(combineReducers({
  greeting
}));

// Components/App.js
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
    <a href="#" onClick={() => setGreeting("konnichiwa")}>japanese</a>
    {' '}
    <a href="#" onClick={() => resetGreeting()}>reset</a>
  </div>

// index.js
ReactDOM.render(
  <Provider {...{store}}><App/></Provider>,
  document.getElementById('root')
);
