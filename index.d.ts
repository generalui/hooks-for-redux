/// <reference types="redux" />
import { Action, Unsubscribe } from "redux";

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

// type Reducers<T, U> = Record<keyof U, Reducer<T>>
// declare function useRedux<TState, TReducers extends Reducers<TState, TReducers>>(

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
  hooks-for-redux functions
****************************/

declare function useRedux<TState>(
  id: string,
  initialState: TState
): [ReactReduxHook<TState>, SetterDispatcher<TState>, VirtualStore<TState>];
declare function useRedux<TState, TReducers extends Reducers<TState>>(
  id: string,
  initialState: TState,
  reducers: TReducers
): [
  ReactReduxHook<TState>,
  Readonly<Dispatchers<TReducers>>,
  VirtualStoreWithReducers<TState, TReducers>
];

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
