import { useReduxState } from 'hooks-for-redux'

const DEFAULT_GREETING = "hello, hooks-for-redux!";

export const [useGreetingSubscription, /*updateGreeting*/, addReducers] =
  useReduxState('greeting', DEFAULT_GREETING);

export const {resetGreeting, setGreeting} = addReducers({
  resetGreeting: () => DEFAULT_GREETING,
  setGreeting: (store, greeting) => greeting
})
