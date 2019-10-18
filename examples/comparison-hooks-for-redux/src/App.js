import React from 'react'
import {useGreetingSubscription, setGreeting, resetGreeting}
  from './greetingReduxState'

const App = () =>
  <div>
    <h1>{ useGreetingSubscription() }</h1>
    <a href="#" onClick={() => setGreeting("こんにちは, hooks-for-redux")}>
      japanese
    </a> <a href="#" onClick={() => resetGreeting()}>reset</a>
  </div>

export default App
