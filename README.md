# hooks-for-redux - DRY up redux

> same redux, less than 1/2 the code

Redux has many wonderful traits, but brevity isn't one of them. Hooks-for-redux strives to reduce the amount of code required to define and manage Redux state. Like how React added "hooks" to clean up Component state management, hooks-for-redux uses a similar, hooks-style API to clean up Redux state management.

This library's primary goal is to reduce Redux code while maintaining maximum compatibility with the Redux platform. The primary strategy is to DRY up the API and use reasonable defaults, with overrides, wherever possible. H4R streamlines reducers, actions, dispatchers, store-creation and hooks for using redux in react as well.

> NOTE: This is NOT a library for "hooking" Redux into React, at least not primarily. react-redux already does this elegantly. Instead, this library wraps react-redux's useSelector, as well as many other standard Redux tools, to provide a more streamlined API.

## Contents

1. [ Usage ](#usage)
1. [ Side-by-Side Comparison](#side-by-side-comparison)
2. [ Install ](#install)
2. [ Examples ](#examples)
2. [ API ](#api)
2. [ License ](#license)
2. [ Produced at GenUI ](#produced-at-genui)

## Usage

Tiny, complete example with no explanation to wet your appetite:

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import {useRedux, Provider} from 'hooks-for-redux'

const [useCount, {incCount, decCount}] = useRedux('count', 0, {
  incCount: (state) => state + 1,
  decCount: (state) => state - 1,
})

const App = () =>
  <p>
    Count: {useCount()}
    {' '}<input type="button" onClick={incCount} value="+"/>
    {' '}<input type="button" onClick={decCount} value="-"/>
  </p>

ReactDOM.render(
  <Provider><App /></Provider>,
  document.getElementById('root')
);
```

## Side-by-Side Comparison

A quick comparison of the simplest app written with both vanilla Redux and hooks-for-redux shows how you can reduce your source by over 66%.

View the source:
* [comparison-vanilla-redux](https://github.com/generalui/hooks-for-redux/tree/master/examples/comparison-vanilla-redux)
* [comparison-hooks-for-redux](https://github.com/generalui/hooks-for-redux/tree/master/examples/comparison-hooks-for-redux)

This example is primarilly intended to give a visual feel for how much code can be saved. Scroll down to learn more about what's going on.

![hooks-for-redux vs vanilla-redux comparison](https://raw.githubusercontent.com/wiki/generalui/hooks-for-redux/hooks-for-redux-comparison.png)



## Install

```
npm install hooks-for-redux
```

## Examples

#### Example A: Use and Set
This is a *complete* redux + react application. Hooks-for-redux dramatically reduces the redux-specific code required to build your app.

> Concept: `useRedux` initializes named redux state and returns a react-hook to subscribe to that state, a function to update that state, and a few more things.

Define your redux-hooks:
```jsx
// NameReduxState.js
import {useRedux} from 'hooks-for-redux'

export const [useName, setName] = useRedux('name', 'Alice')
```

Use your redux-hooks:
```jsx
// App.jsx
import React from 'react';
import ReactDOM from 'react-dom';
import {useName, setName} from './NameReduxState.js'

export default () =>
  <p onClick={
    () => setName((name) => name == 'Alice' ? 'Bob' : 'Alice')
  }>
    Hello there, {useName()}! Click to change me.
  </p>
```

Configure your redux Provider:
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

#### Example B: Custom Reducers
Instead of returning the raw update reducer, you can build your own reducers. Your code will be less brittle and more testable the more specific you can make your transactional redux update functions ('reducers').

> Concept: When you pass in a reducer-map, useRedux returns set of matching dispatchers, one for each of your reducers.

Here's how to re-write Example-A with custom reducers:

```jsx
// NameReduxState.js
import {useRedux} from 'hooks-for-redux'

export const [useName, {toggleName}] = useRedux('name', 'Alice', {
  toggleName: (state, name) => name == 'Alice' ? 'Bob' : 'Alice')
})
```

```jsx
// App.jsx
import React from 'react';
import {useName, toggleName} from './NameReduxState.js'

export default () =>
  <p onClick={toggleName}>
    Hello there, {useName()}! Click to change me.
  </p>
```
> Use `index.js` from Example-A to complete this app.

#### Example: Custom Middleware

By default, hooks-for-react auto-vivifies a redux store for you, but if you want to control how the store gets created, use the steps below.

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
import { Provider } from 'hooks-for-redux'
import './store'  // <<< import before using useRedux
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
useRedux(storeKey, initialState) => [useStoreKey, setStoreKey]
useRedux(storeKey, initialState, reducers) => [useStoreKey, dispatchers]
```
In most cases, all you really need is useRedux, as seen in the example above.

* **IN**: (storeKey, initialState)
  - storeKey:     string
  - initialState: non-null, non-undefined
  - reducers: object mapping action names to reducers
    - e.g. `{myAction: (state, payload) => newState}`

* **OUT**: [useStoreKey, setStoreKey -or- dispatchers]
  - useStoreKey: (see below) `() => state`
  - dispatchers: object mapping action names to dispatchers
    - e.g. `{myAction: (payload) => dispatch('myAction', payload)}`

#### useStoreKey
```jsx
const [useStoreKey] = useRedux(storeKey, initialState)
const MyComponent = () => { // must be used in render function
  useStoreKey() => current state
  // ...
}
```
  - **OUT**: current state
  - **REQUIRED**: must be called within a Component's render function
  - **EFFECT**:
    - Establishes a subscription for any component that uses it. The component will re-render whenever `update` is called, and `useStoreKey` will return the latest, updated value within that render.
    - Internally, useStoreKey is simply:<br>`useSelector(state => state[storeKey])`<br>see: https://react-redux.js.org/next/api/hooks for details.

#### dispatchers
```jsx
const [__, {myAction}] = useRedux(storeKey, initialState, {
  myAction: (state, payload) => state
})
myAction(payload) => {type: MyAction, payload}
```

  - **IN**: payload - after dispatching, will arrive as the payload for the matching reducer
  - **OUT**: {type, payload}
    - type: the key string for the matching reducer
    - payload: the payload that was passed in
    - i.e. same as vanilla redux's store.dispatch()


### getStore

```jsx
import {getStore} from 'hooks-for-redux'
getStore() => store
```

* **IN**:     nothing
* **OUT** :    redux store
* **EFFECT** : Auto-vivifies a store if setStore has not been called. Otherwise, it returns the store passed to setStore.

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

### Provider Component

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

## License

hooks-for-redux is [MIT licensed](./LICENSE).

## Produced at GenUI

hooks-for-redux was [developed in JavaScript for React and Redux at GenUI.co](https://www.genui.co).
