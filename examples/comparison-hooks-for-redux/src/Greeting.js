import { createReduxModule } from "hooks-for-redux";

const DEFAULT_GREETING = "hello, hooks-for-redux!";

export const [useGreeting, { resetGreeting, setGreeting }] = createReduxModule(
  "greeting",
  DEFAULT_GREETING,
  {
    resetGreeting: () => DEFAULT_GREETING,
    setGreeting: (store, greeting) => greeting
  }
);
