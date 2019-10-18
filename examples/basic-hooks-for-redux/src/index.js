import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import {useReduxState, Provider} from 'hooks-for-redux'

// ReduxState/greeting.js
const DEFAULT_GREETING = "hello, hooks-for-redux!";

const [useGreetingSubscription, /*updateGreeting*/, addReducers] =
  useReduxState('greeting', DEFAULT_GREETING);

const {resetGreeting, setGreeting} = addReducers({
  resetGreeting: () => DEFAULT_GREETING,
  setGreeting: (store, greeting) => greeting
})

// Components/App.js
const App = () =>
  <div>
    <h1>{ useGreetingSubscription() }</h1>
    <a href="#" onClick={() => setGreeting("konnichiwa")}>japanese</a>
    {' '}
    <a href="#" onClick={() => resetGreeting()}>reset</a>
  </div>

// index.js
ReactDOM.render(
  <Provider><App/></Provider>,
  document.getElementById('root')
);
