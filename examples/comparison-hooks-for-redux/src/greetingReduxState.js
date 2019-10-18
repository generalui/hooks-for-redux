import { useReduxState } from 'hooks-for-redux'

const DEFAULT_GREETING = "hello, hooks-for-redux!";

const [useGreetingSubscription, /*updateGreeting*/, addReducers] =
  useReduxState('greeting', DEFAULT_GREETING);

const {resetGreeting, setGreeting} = addReducers({
  resetGreeting: () => DEFAULT_GREETING,
  setGreeting: (store, greeting) => greeting
})

export {useGreetingSubscription, resetGreeting, setGreeting}