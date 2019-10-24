import React from 'react';
import ReactDOM from 'react-dom';
import {useRedux, Provider} from 'hooks-for-redux'

const [useCount, {incCount, decCount}] = useRedux('count', 0, {
  incCount: (state) => state + 1,
  decCount: (state) => state - 1,
})

const App = () =>
  <p>
    Count: {useCount()}
    {' '}<input type="button" onClick={incCount} value="+"/>
    {' '}<input type="button" onClick={decCount} value="-"/>
  </p>

ReactDOM.render(
  <Provider><App /></Provider>,
  document.getElementById('root')
);