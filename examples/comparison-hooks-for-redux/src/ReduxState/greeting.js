import { useReduxState } from 'hooks-for-redux'

const DEFAULT_GREETING = "hello, hooks-for-redux!";

export const [useGreeting, {resetGreeting, setGreeting}] =
  useRedux('greeting', DEFAULT_GREETING, {
    resetGreeting: () => DEFAULT_GREETING,
    setGreeting: (store, greeting) => greeting
  });
