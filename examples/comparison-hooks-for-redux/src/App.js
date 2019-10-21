import React from 'react'
import {useGreeting, setGreeting, resetGreeting}
  from './ReduxState/greeting'

const App = () =>
  <div>
    <h1>{ useGreeting() }</h1>
    <a href="#" onClick={() => setGreeting("こんにちは, hooks-for-redux")}>
      japanese
    </a> <a href="#" onClick={() => resetGreeting()}>reset</a>
  </div>

export default App
