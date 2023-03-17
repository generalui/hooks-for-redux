import { createReduxModule } from "hooks-for-redux";

const STORE_NAME = "counter";

/**
 * This will check for the localStorage Item for initial state.
 * If it doesn't exist, it will be 0.
 */
const initialState = parseInt(localStorage.getItem(STORE_NAME)) || 0;

/**
 * createReduxModule returns a virtualStore for the current Redux Store
 */
export const [
  useCounter,
  { increment, decrement, reset },
  counterVirtualStore,
] = createReduxModule(STORE_NAME, initialState, {
  increment: (state) => state + 1,
  decrement: (state) => state - 1,
  reset: () => 0,
});

export const clearLocalStorageCounter = () => {
  localStorage.removeItem(STORE_NAME);
};

/**
 * Subscribe to the virtualStore and update local storage
 * when update are detected
 */
counterVirtualStore.subscribe((state) => {
  localStorage.setItem(STORE_NAME, state);
});
