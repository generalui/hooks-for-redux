import { createReduxModule } from "hooks-for-redux";

const STORE_NAME = "counter";

const initialState = parseInt(localStorage.getItem(STORE_NAME)) || 0;

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

counterVirtualStore.subscribe((state) => {
  localStorage.setItem(STORE_NAME, state);
});
