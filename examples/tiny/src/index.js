import React from 'react';
import ReactDOM from 'react-dom';
import {createReduxModule, Provider} from 'hooks-for-redux'

const [useCount, {inc, add, reset}] = createReduxModule('count', 0, {
  inc: (state) => state + 1,
  add: (state, amount) => state + amount,
  reset: () => 0
})

const App = () =>
  <p>
    Count: {useCount()}
    {' '}<input type="button" value="+1"    onClick={inc} />
    {' '}<input type="button" value="+10"   onClick={() => add(10)} />
    {' '}<input type="button" value="reset" onClick={reset} />
  </p>

ReactDOM.render(
  <Provider><App /></Provider>,
  document.getElementById('root')
);