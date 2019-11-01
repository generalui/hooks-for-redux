/// <reference types="redux" />
import {Action, Unsubscribe} from 'redux'

type RestParams<T> = T extends (arg: any, ...args: infer A) => void ? A : never

type Getter<T> = () => T

interface PayloadAction<T> extends Action<string> {
  payload: T
}

type SetterDispatcher<T> = (state: T) => PayloadAction<T>

type Reducer<T> = (state: T, payload: any) => T

type Reducers<T, U> = Record<keyof U, Reducer<T>>

type Dispatcher<TReducer> = (...args: RestParams<TReducer>) =>
  PayloadAction<RestParams<TReducer>[0]>

type Dispatchers<TReducers> = {
  [K in keyof TReducers]: Dispatcher<TReducers[K]>
}

type VirtualStoreWithReducers<TState, TReducers> = {
  getState: () => TState,
  getReducers: () => TReducers,
  subscribe: (callback: (state:TState) => void) => Unsubscribe
}

type VirtualStore<TState> = {
  getState: () => TState,
  subscribe: (callback: (state:TState) => void) => Unsubscribe
}

declare function useRedux<TState>(id: string, initialState: TState): [
  Getter<TState>,
  SetterDispatcher<TState>,
  VirtualStore<TState>
]
declare function useRedux<TState, TReducers extends Reducers<TState, TReducers>>(
    id: string,
    initialState: TState,
    reducers: TReducers,
): [
    Getter<TState>,
    Readonly<Dispatchers<TReducers>>,
    VirtualStoreWithReducers<TState, TReducers>,
]

// const [getBar2, setBar2] = useRedux('bar', 0)
// getBar2()
// setBar2(1)

// const [getBar, { addToBar, addSevenToBar }] = useRedux('bar', 0, {
//   addSevenToBar: (state) => state + 7,
//   addToBar: (state, payload: number) => state + payload,
// })

// getBar().toPrecision()

// addSevenToBar()
// addToBar(8)

// TEST: https://www.typescriptlang.org/play/index.html#code/C4TwDgpgBAggxsAlgewHYB4AqA+KBeKAb1EgC4pMBfAWACgToBVVAZwFcAjFuAJ0Q+gEAFAEp8uAG7JEAEzp0GUAEoQWwAAoBDHpoC2LLLgKYoEAB7AIqGSyhDtAc3KbUIADRQAdN8ctyiVAAzCB5YMTxJaRkoAH5YKHJUCAkQ+XpwaABxCGBLHkN8O3DcTDSAvMDNOGgtEAAbZE0ZeCQ0AvNLa1sWlAw1PlQHXEI6KCgwTXrGmXJS2hpaBQyoAGUcvIARRBYJ4DgACxCC4TVNS1niqFqGpp62nDTFFRk2avycQqFT84oPCamms5XJc5ktIMoIC83gZMB5GEYIXBkDwZOgANYQEDIQJQRgeZ6vI44bCPZZbHZnA5EglvBFCbyeXzkFRqLQ6fRYGkhbDFUZXSY3ZoIXroFkabR6GFcnjYADaAAYALokxbpcHk3ZUnhSyGE7UIka0MaygDSUACUAxWJxmGlLEV5A1lMO7ztpuVdAWYOgADVEDxgGxNHUVsBkRAAOqIYD7O1YUNnCAeW266EGvkOHIJn6icQUbNJjM5O3kXMRCh2tx89hcXj8CCluDBuocKpo0vfBuYAuXKSyS7MGvcPgCT2k8F+gNBkNhngQePARPpo1QTPAAulkEFqsrod1gSN5utuDtuyd0jdxeWXtRAesTjD+tj1UyCBwOraaCBNioYVoKBsCwEAEmYC5LkIsjkP0AQOB4ATRogwYbvmV4QCI5Cyny2S5ESBbYDuYxrDhPBOnsLpgZY+F8pOgZIbO86XkudCKnQr7vp+UDfr+rSoABQEgRRSYVqmIS2B0Vg2BCUKiYJyZ2tg2BCHyYyQVA0GDARYzmqgCF0YmszbspUBztJ2qzJWdDoVAmErmM2F5IJVG2RCTRoHUIDoKRWo6qZLAKZpYw0dOobhlGMZxoxlhySJ+o7ixqpIqwwDWWuABC2gAEweEBwDpTwGWKoUgHAbqZhCAA5K2PDlR48oiHQaWZaIdA5XlGVCAAjPVCVoGoKU5HlHiEFATQyJgyCDSNMgyGsKSoONeVQJQhUEMVIEVVVNVQPKQ1GaNs1WAt2gdqhlydlAADUUAAOwBVNY0TcdZ6oX8ArTIkbC6AIPBnahl3jG9TQ7pQYgAPSg1AHhpI1PCiJ4YbqHOcDbL0zWqvtySHY9sPdaNR2wwAHN1QA