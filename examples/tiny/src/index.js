import React from 'react';
import ReactDOM from 'react-dom';
import {useRedux, Provider} from 'hooks-for-redux'

const [useCount, {inc, add, reset}] = useRedux('count', 0, {
  inc: (state) => state + 1,
  add: (state, amount) => state + amount,
  reset: () => 0
})

const App = () =>
  <p>
    Count: {useCount()}
    {' '}<input type="button" onClick={inc} value="+1"/>
    {' '}<input type="button" onClick={() => add(10)} value="+10"/>
    {' '}<input type="button" onClick={reset} value="reset"/>
  </p>

ReactDOM.render(
  <Provider><App /></Provider>,
  document.getElementById('root')
);