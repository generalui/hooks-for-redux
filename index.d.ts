/// <reference types="redux" />
/// <reference types="react" />
import { Action, Unsubscribe, AnyAction, Store } from "redux";
import { Component } from "react"

/****************************
  util
****************************/
type RestParams<TFunction> = TFunction extends (arg: any, ...args: infer A) => void ? A : never;

/****************************
  hook
****************************/
type ReactReduxHook<TState> = () => TState;

/****************************
  reducers
****************************/
type Reducer<TState> = (state: TState, payload: any) => TState;

interface Reducers<TState> {
  [reducerName: string]: Reducer<TState>;
}

/****************************
  virtualStores
****************************/
type VirtualStoreWithReducers<TState, TReducers> = {
  getState: () => TState;
  getReducers: () => TReducers;
  subscribe: (callback: (state: TState) => void) => Unsubscribe;
};

type VirtualStore<TState> = {
  getState: () => TState;
  subscribe: (callback: (state: TState) => void) => Unsubscribe;
};

/****************************
  dispatchers
****************************/
interface PayloadAction<TPayload> extends Action<string> {
  payload: TPayload;
}

type SetterDispatcher<TState> = (state: TState) => PayloadAction<TState>;

type Dispatcher<TReducer> = (
  ...args: RestParams<TReducer>
) => PayloadAction<RestParams<TReducer>[0]>;

type Dispatchers<TReducers> = {
  [K in keyof TReducers]: Dispatcher<TReducers[K]>;
};

/****************************
  createReduxModule function
****************************/

/**
 * Defines a top-level property of the redux state including its inital value, all related reducers, and returns a react-hook, dispatchers and virtualStore.
 *
 * @param reduxStorePropertyName is the name of the property off the root redux store you are declaring and initializing
 *
 * @param initialState is the initial value for your redux state
 *
 * @param [reducers] is a map from reducer-name to reducer functions which take the currentState plus optional payload and return a new state.
 *
 * @returns a 3-element array: [reactHook, updateDispatcher or dispatcherMap, virtualStore]
 */
export function createReduxModule<TState>(
  reduxStorePropertyName: string,
  initialState: TState
): [ReactReduxHook<TState>, SetterDispatcher<TState>, VirtualStore<TState>];
export function createReduxModule<TState, TReducers extends Reducers<TState>>(
  reduxStorePropertyName: string,
  initialState: TState,
  reducers: TReducers
): [
  ReactReduxHook<TState>,
  Readonly<Dispatchers<TReducers>>,
  VirtualStoreWithReducers<TState, TReducers>
];

/**
 * Defines a top-level property of the redux state including its inital value, all related reducers, and returns a react-hook, dispatchers and virtualStore.
 *
 * @param reduxStorePropertyName is the name of the property off the root redux store you are declaring and initializing
 *
 * @param initialState is the initial value for your redux state
 *
 * @param [reducers] is a map from reducer-name to reducer functions which take the currentState plus optional payload and return a new state.
 *
 * @returns a 3-element array: [reactHook, updateDispatcher or dispatcherMap, virtualStore]
 *
 * @deprecated Use createReduxModule instead. Same API, new name.
 */
export function useRedux<TState>(
  reduxStorePropertyName: string,
  initialState: TState
): [ReactReduxHook<TState>, SetterDispatcher<TState>, VirtualStore<TState>];
export function useRedux<TState, TReducers extends Reducers<TState>>(
  reduxStorePropertyName: string,
  initialState: TState,
  reducers: TReducers
): [
  ReactReduxHook<TState>,
  Readonly<Dispatchers<TReducers>>,
  VirtualStoreWithReducers<TState, TReducers>
];

/****************************
  other hooks-for-redux functions
****************************/
export interface ReduxStoreWithInjectReducers extends Store {
  injectReducer(key:string, reducer:Reducer<object>) : void
}

/**
 * Auto-vivifies a store if setStore has not been called. Otherwise, it returns the store passed to setStore.
 *
 * @returns current or newly crated store
 */
export function getStore() : ReduxStoreWithInjectReducers

/**
 * Call setStore to provide your own store for hooks-for-redux to use. You'll need to use this if you want to use middleware.
 *
 * @param [store] store to set in the store-registry
 *
 * @returns store
 */
export function setStore(store : ReduxStoreWithInjectReducers) : ReduxStoreWithInjectReducers

/**
 * Creates a Redux store that holds the state tree.
 * The only way to change the data in the store is to call `dispatch()` on it.
 *
 * There should only be a single store in your app. To specify how different
 * parts of the state tree respond to actions, you may combine several
 * reducers
 * into a single reducer function by using `combineReducers`.
 *
 * @template TState State object type.
 *
 * @param reducers An object whose values correspond to different reducer
 *   functions that need to be combined into one.
 *
 * @param [initialState] The initial state.
 *
 * @param [enhancer] The store enhancer. You may optionally specify it to
 *   enhance the store with third-party capabilities such as middleware, time
 *   travel, persistence, etc. The only store enhancer that ships with Redux
 *   is `applyMiddleware()`.
 *
 * @returns A Redux store that lets you read the state, dispatch actions and
 *   subscribe to changes.
 */
export function createStore<TState>(reducers: Reducers<object>, initialState?: TState, enhancer?: any) : ReduxStoreWithInjectReducers

export interface ProviderProps<A extends Action = AnyAction> {
  /**
   * The single Redux store in your application.
   */
  store?: Store<any, A>;
  /**
   * Optional context to be used internally in react-redux. Use React.createContext() to create a context to be used.
   * If this is used, generate own connect HOC by using connectAdvanced, supplying the same context provided to the
   * Provider. Initial value doesn't matter, as it is overwritten with the internal state of Provider.
   */
  context?: Context<ReactReduxContextValue>;
}

/**
 * Makes the Redux store available to the connect() calls in the component hierarchy below.
 */
export class Provider<A extends Action = AnyAction> extends Component<ProviderProps<A>> { }

/****************************
  type testing
****************************/

// type Unsubscribe = () => void
// export interface Action<T = any> {
//   type: T
// }

// const [getBar2, setBar2] = useRedux('bar', 0)
// getBar2()
// setBar2(1)

// const [getBar, {addSevenToBar, addToBar, addString}] = useRedux('bar', 0, {
//   addSevenToBar: (state) => state + 7,
//   addToBar: (state, payload) => state + payload,
//   addString:(state, myThing:string) => state + +myThing
// })

// getBar().toPrecision()

// addSevenToBar()
// addToBar(8)
// addString("9")

// TEST: https://www.typescriptlang.org/play/index.html#code/C4TwDgpgBAggxsAlgewHYB4AqA+KBeKAb1EgC4pMBfAWACgToBVVAZwFcAjFuAJ0Q+gEAFAEp8uAG7JEAEzp0GUAEoQWwAAoBDHpoC2LLLgKYoEAB7AIqGSyhDtAc3KbUIADRQAdN8ctyiVAAzCB5YMTxJaRkoAH5YKHJUCAkQ+XpwaABxCGBLHkN8O3DcTDSAvMDNOGgtEAAbZE0ZeCQ0AvNLa1sWlAw1PlQHXEI6KCgwTXrGmXJS2hpaBQyoAGUcvIARRBYJ4DgACxCC4TVNS1niqFqGpp62nDTFFRk2avycQqFT84oPCamms5XJc5ktIMoIC83gZMB5GEYIXBkDwZOgANYQEDIQJQRgeZ6vI44bCPZZbHZnA5EglvBFCbyeXzkFRqLQ6fRYGkhbDFUZXSY3ZoIXroFkabR6GFcnjYADaAAYALokxbpcHk3ZUnhSyGE7UIka0MaygDSUACUAxWJxmGlLEV5A1lMO7ztpuVdAWYOgADVEDxgGxNHUVsBkRAAOqIYD7O1YUNnCAeW266EGvkOHIJn6icQUbNJjM5O3kXMRCh2tx89hcXj8CCluDBuocKpo0vfBuYAuXKSyS7MGvcPgCT2k8F+gNBkNhngQePARPpo1QTPAAulkEFqsrod1gSN5utuDtuyd0jdxeWXtRAesTjD+tj1UyCBwOraaCBNioYVoKBsCwEAEmYC5LkIsjkP0AQOB4ATRogwYbvmV4QCI5Cyny2S5ESBbYDuYxrDhPBOnsLpgZY+F8pOgZIbO86XkudCKnQr7vp+UDfr+rSoABQEgRRSYVqmIS2B0Vg2BCUKiYJyZ2tg2BCHyYyQVA0GDARYzmqgCF0YmszbspUBztJ2qzJWdDoVAmErmM2F5IJVG2RCTRoHUIDoKRWo6qZLAKZpYw0dOobhlGMZxoxlhySJ+o7ixqpIqwwDWWuABC2gAEweEBwDpTwGWKoUgHAbqZhCAA5K2PDlR48oiHQaWZaIdA5XlGVCAAjPVCVoGoKU5HlHiEFATQyJgyCDSNMgyGsKSoONeVQJQhUEMVIEVVVNVQPKQ1GaNs1WAt2gdqhlydlAADUUAAOwBVNY0TcdZ6oX8ArTIkbC6AIPBnahl3jG9TQ7pQYgAPSg1AHhpI1PCiJ4YbqHOcDbL0zWqvtySHY9sPdaNR2wwAHN1QA
