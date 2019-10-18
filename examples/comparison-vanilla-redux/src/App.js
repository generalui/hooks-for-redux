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