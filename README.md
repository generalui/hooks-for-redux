# hooks-for-redux (H4R) - DRY up redux

> same redux, less than 1/2 the code

Redux has many wonderful traits, but brevity isn't one of them. Hooks-for-redux strives to reduce the amount of code required to define and manage Redux state. Like how React added "hooks" to clean up Component state management, hooks-for-redux uses a similar, hooks-style API to clean up Redux state management.

This library's primary goal is to reduce Redux code while maintaining maximum compatibility with the Redux platform. The primary strategy is to DRY up the API and use reasonable defaults, with overrides, wherever possible. H4R streamlines reducers, actions, dispatchers, store-creation and hooks for using redux in react as well.

> NOTE: This is NOT a library for "hooking" Redux into React, at least not primarily. react-redux already does this elegantly. Instead, this library wraps react-redux's useSelector, as well as many other standard Redux tools, to provide a more streamlined API.

## Contents

1. [ Install ](#install)
1. [ Usage ](#usage)
1. [ Comparison](#comparison)
2. [ Tutorial ](#tutorial)
2. [ API ](#api)
2. [ TypeScript ](#typescript)
2. [ License ](#license)
2. [ Produced at GenUI ](#produced-at-genui)


## Install

```
npm install hooks-for-redux
```

## Usage

Tiny, complete example. See below for explanations.

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import {useRedux, Provider} from 'hooks-for-redux'

const [useCount, {inc, add, reset}] = useRedux('count', 0, {
  inc: (state) => state + 1,
  add: (state, amount) => state + amount,
  reset: () => 0
})

const App = () =>
  <p>
    Count: {useCount()}
    {' '}<input type="button" onClick={inc} value="+1"/>
    {' '}<input type="button" onClick={() => add(10)} value="+10"/>
    {' '}<input type="button" onClick={reset} value="reset"/>
  </p>

ReactDOM.render(
  <Provider><App /></Provider>,
  document.getElementById('root')
);
```

* source: [examples/tiny](https://github.com/generalui/hooks-for-redux/tree/master/examples/tiny)

## Comparison

This is a quick comparison of a simple app implemented with both vanilla Redux and hooks-for-redux. In this example, 66% of redux-specific code was elliminated.

View the source:
* [comparison-vanilla-redux](https://github.com/generalui/hooks-for-redux/tree/master/examples/comparison-vanilla-redux)
* [comparison-hooks-for-redux](https://github.com/generalui/hooks-for-redux/tree/master/examples/comparison-hooks-for-redux)

This example is primarilly intended to give a visual feel for how much code can be saved. Scroll down to learn more about what's going on.

![hooks-for-redux vs vanilla-redux comparison](https://raw.githubusercontent.com/wiki/generalui/hooks-for-redux/hooks-for-redux-comparison.png)

## Tutorial

#### Example A: Use and Set
The core of hooks-for-redux is the `useRedux` method. There are two ways to call useRedux - with and without custom reducers. This first example shows the first, easiest way to use hooks-for-redux.

> Concept: `useRedux` initializes redux state under the property-name you provide and returns an array, containing three things:
> 1. react-hook to access named-state
> 2. dispatcher-function to update that state
> 3. virtual store

First, you'll need to define your redux state.

```jsx
// NameReduxState.js
import {useRedux} from 'hooks-for-redux'

//  - initialize redux state.name = 'Alice'
//  - export useCount hook for use in components
//  - export setCount to update state.name
export const [useCount, setCount] = useRedux('count', 0)
```

Use your redux state:
- add a "+" button that adds 1 to count
- useCount()
  - returns the current count
  - rerenders when count changes

```jsx
// App.jsx
import React from 'react';
import ReactDOM from 'react-dom';
import {useCount, setCount} from './NameReduxState.js'

export default () => {
  const count = useCount()
  const inc = () => setCount(count + 1)
  <p>
    Count: {count}
    {' '}<input type="button" onClick={inc} value="+"/>
  </p>
}
```

The last step is to wrap your root component with a Provider. H4R provides a streamlined version of the Provider component from [react-redux](https://react-redux.js.org/) to make your redux store available to the rest of your app. H4R's Provider automatically connects to the default store:
```jsx
// index.jsx
import React from 'react';
import { Provider } from 'hooks-for-redux'
import App from './App'

ReactDOM.render(
  <Provider><App /></Provider>,
  document.getElementById('root')
);
```

And that's all you need to do! Now, let's look at a fuller example with custom reducers.

#### Example B: Custom Reducers
Instead of returning the raw update reducer, you can build your own reducers. Your code will be less brittle and more testable the more specific you can make your transactional redux update functions ('reducers').

> Concept: When you pass a reducer-map as the 3rd argument, useRedux returns set of matching map of dispatchers, one for each of your reducers.

This example adds three reducer/dispatcher pairs: `inc`, `dec` and `reset`.
```jsx
// NameReduxState.js
import {useRedux} from 'hooks-for-redux'

export const [useName, {inc, add, reset}] = useRedux('count', 0, {
  inc: (state) => state + 1,
  add: (state, amount) => state + amount,
  reset: () => 0
})
```

Now the interface supports adding 1, adding 10 and resetting the count.

```jsx
// App.jsx
import React from 'react';
import {useName, inc, add, reset} from './NameReduxState.js'

export default () =>
  <p>
    Count: {useCount()}
    {' '}<input type="button" onClick={inc} value="+1"/>
    {' '}<input type="button" onClick={() => add(10)} value="+10"/>
    {' '}<input type="button" onClick={reset} value="reset"/>
  </p>
```
> Use `index.js` from Example-A to complete this app.

#### Example: Custom Middleware

You may have noticed none of the code above actually calls Redux.createStore(). H4R introduces the concept of a default store accessable via the included `getStore()` and `setStore()` functions. The first time `getStore()` is called, a new redux store is automatically created for you. However, if you want to control how the store is created, call `setStore()` and pass in your custom store before calling `getStore` or any other function which calls it indirectly including `useRedux` and `Provider`.

Below is an example of creating your own store with some custom middleware. It uses H4R's own createStore method which extends Redux's create store as required for H4R. More on that below.
```jsx
// store.js
import { setStore, createStore } from 'hooks-for-redux'
import { applyMiddleware } from 'redux'

// example middle-ware
const logDispatch = store => next => action => {
  console.log('dispatching', action)
  return next(action)
}

export default setStore(createStore(
  {},
  applyMiddleware(logDispatch)
))
```
```jsx
// index.jsx
import React from 'react';
import './store'  // <<< import before calling useRedux or Provider
import { Provider } from 'hooks-for-redux'
import App from './App'

ReactDOM.render(
  <Provider><App /></Provider>,
  document.getElementById('root')
);
```

> NOTE: You don't have to use hooks-for-redux's createStore, but setStore must be passed a store that supports the injectReducer method as described here: https://redux.js.org/api/combinereducers

## API

### useRedux
```jsx
import {useRedux} from 'hooks-for-redux'
useRedux(reduxStorePropertyName, initialState) =>
  [useMyStore, setMyStore, virtualStore]

useRedux(reduxStorePropertyName, initialState, reducers) =>
  [useMyStore, myDispatchers, virtualStore]
```

Define a top-level property of the redux state including its inital value, all related reducers, and returns a react-hook, dispatchers and virtualStore.

* **IN**: (reduxStorePropertyName, initialState)
  - reduxStorePropertyName:     string
  - initialState: non-null, non-undefined
  - reducers: object mapping action names to reducers
    - e.g. `{myAction: (state, payload) => newState}`

* **OUT**: [useMyStore, setMyStore -or- myDispatchers, virtualStore]
  - useMyStore: react hook returning current state
  - One of the following:
    - setMyStore: (newState) => dispatch structure
    - myDispatchers: object mapping action names to matching myDispatchers
  - virtualStore: object with API similar to a redux store, but just for the state defined in this useRedux call


#### useMyStore
```jsx
const [useMyStore] = useRedux(reduxStorePropertyName, initialState)
const MyComponent = () => { // must be used in render function
  useMyStore() => current state
  // ...
}
```
  - **OUT**: current state
  - **REQUIRED**: must be called within a Component's render function
  - **EFFECT**:
    - Establishes a subscription for any component that uses it. The component will re-render whenever `update` is called, and `useMyStore` will return the latest, updated value within that render.
    - Internally, useMyStore is simply:<br>`useSelector(state => state[reduxStorePropertyName])`<br>see: https://react-redux.js.org/next/api/hooks for details.

#### myDispatchers
```jsx
const [__, {myAction}] = useRedux(reduxStorePropertyName, initialState, {
  myAction: (state, payload) => state
})
myAction(payload) => {type: MyAction, payload}
```

  - **IN**: payload - after dispatching, will arrive as the payload for the matching reducer
  - **OUT**: {type, payload}
    - type: the key string for the matching reducer
    - payload: the payload that was passed in
    - i.e. same as vanilla redux's store.dispatch()

### virtualStore API

The virtual store is an object similar to the redux store, except it is only for the redux-state you created with useRedux. It supports a similar, but importantly different API from the redux store:

#### virtualStore.getState
```jsx
import {useRedux, getStore} from 'hooks-for-redux'
const [,, myVirtualStore] = useRedux("myStateName", myInitialState)
myVirtualStore.getState() =>
  getStore().getState()["myStateName"]
```

The getState method works exactly like a redux store except instead of returning the state of the entire redux store, it returns only the sub portion of that redux state defined by the useRedux call.

  - **IN**: (nothing)
  - **OUT**: your current state

#### virtualStore.subscribe
```jsx
import {useRedux, getStore} from 'hooks-for-redux'
const [,, myVirtualStore] = useRedux("myStateName", myInitialState)
myVirtualStore.subscribe(callback) => unsubscribe
```

  - **IN**:   callback(currentState => ...)
  - **OUT**:  unsubscribe()

The subscribe method works a little differently from a redux store. Like reduxStore.subscribe, it too returns a function you can use to unsubscribe. Unlike reduxStore.subscribe, the callback passed to virtualStore.subscribe has two differences:

1. callback is passed the current value of the virtualStore directly (same value returned by virutalStore.getState())
2. callback is *only* called when virtualStore's currentState !== its previous value.


### Provider

```jsx
import {Provider} from 'hooks-for-redux'
<Provider>{/* render your App's root here*/}<Provider>
```

hooks-for-redux includes its own `Provider` component shortcut. It is equivalent to:

```jsx
import {Provider} from 'react-redux'
import {getState} from 'hooks-for-redux'

<Provider state={getState()}>
  {/* render your App's root here*/}
<Provider>
```


### getStore

```jsx
import {getStore} from 'hooks-for-redux'
getStore() => store
```

Auto-vivifies a store if setStore has not been called. Otherwise, it returns the store passed to setStore.

* **IN**:     nothing
* **OUT** :    redux store

### setStore
```jsx
import {setStore} from 'hooks-for-redux'
setStore(store) => store
```

Call setStore to provide your own store for hooks-for-redux to use. You'll need to use this if you want to use middleware.

* **IN**:   any redux store supporting .injectReducer
* **OUT**:  the store passed in
* **REQUIRED**:
  - can only be called once
  - must be called before getStore or useRedux

### createStore
```jsx
import {createStore} from 'hooks-for-redux'
createStore(reducersMap, [preloadedState], [enhancer]) => store
```

Create a basic redux store with injectReducer support. Use this to configure your store's middleware.

* **IN**
  - reducersMap:    object suitable for Redux.combineReducers https://redux.js.org/api/combinereducers
  - **OPTIONAL**: preloadedState & enhancer: see Redux.createStore https://redux.js.org/api/createstore

* **OUT**: redux store supporting .injectReducer

### store.injectReducer

```jsx
store.injectReducer(reducerName, reducer) => ignored
```
If you just want to use Redux's createStore with custom parameters, see the [Custom Middleware Example](#example-custom-middleware). However, if you want to go further and provide your own redux store, you'll need to implement `injectReducer`.

* **IN**:
  - reducerName:  String
  - reducer:      (current-reducer-named-state) => nextState

* **EFFECT**:   adds reducer to the reducersMaps passed in at creation time.
* **REQUIRED**:
  - {[reducerName]: reducer} should be suitable for React.combineReducers https://redux.js.org/api/combinereducers

Hooks-for-redux requires a store that supports the injectReducer. You only need to worry about this if you are using setState to manually set your store *and* you are note using hooks-for-redux's own createStore function.

The injectReducer method is described here https://redux.js.org/recipes/code-splitting. Its signature looks like:

> NOTE: Just as any other reducer passed to React.combineReducers, the reducer passed to injectReducer doesn't get passed the store's entire state. It only gets passed, and should return, its own state data which is stored in the top-level state under the provided reducerName.

## TypeScript

TypeScript support is provided in the library. Configuring the generics for H4R was tricky, particularly for the useRedux method. We'd welcome feedback on how we can improve our typing.

- [hooks-for-redux type definition](https://github.com/generalui/hooks-for-redux/blob/master/index.d.ts)

## License

hooks-for-redux is [MIT licensed](./LICENSE).

## Produced at GenUI

hooks-for-redux was [developed in JavaScript for React and Redux at GenUI.co](https://www.genui.co).
