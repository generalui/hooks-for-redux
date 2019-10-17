# hooks-for-redux

Wouldn't it be nice if you could use the elegant syntax of React-hooks when dealing with Redux?

## INSTALL

```
npm install hooks-for-redux
```

## Examples

#### Example-A
This is a *complete* redux + react application. Hooks-for-redux dramatically reduces the redux-specific code required to build your app.

> Concept: `useReduxState` initializes named redux state and returns a react-hook to subscribe to that state, a function to update that state, and a few more things.

Define your redux-hooks:
```jsx
// NameHook.js
import {useReduxState} from 'hooks-for-redux'

const [useNameSubscription, updateName] = useReduxState('name', 'Alice')

export {useNameSubscription, updateName}
```

Use your redux-hooks:
```jsx
// App.jsx
import React from 'react';
import ReactDOM from 'react-dom';
import {useNameSubscription, updateName} from './NameHook.js'

export default () =>
  <p onClick={
    () => updateName((name) => name == 'Alice' ? 'Bob' : 'Alice')
  }>
    Hello there, {useNameSubscription()}! Click to change me.
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

#### Example-B - addReducers
Instead of returning the raw update reducer, you can build your own reducers. Your code will be less brittle and more testable the more specific you can make your transactional redux update functions ('reducers').

> Concept: `addReducers` is the third element returned from `useReduxState`. It takes a action-type-to-reducer-map and returns a dispatcher map for the same action-types.

```jsx
// NameHook.js
import {useReduxState} from 'hooks-for-redux'

const [useNameSubscription, __, addReducers] = useReduxState('name', 'Alice')

const {toggleName} = addReducers({
  toggleName: (name) => name == 'Alice' ? 'Bob' : 'Alice')
})

export {useNameSubscription, toggleName}
```

```jsx
// App.jsx
import React from 'react';
import {useNameSubscription, toggleName} from './NameHook.js'

export default () =>
  <p onClick={toggleName}>
    Hello there, {useNameSubscription()}! Click to change me.
  </p>
```
> Use the `index.js` file from Example-A to complete this app.

## API

### useReduxState
```jsx
import {useReduxState} from 'hooks-for-redux'
useReduxState(storeKey, initialState) =>
  [useSubscription, update, addReducers, inspect]
```
In most cases, all you really need is useReduxState, as seen in the example above.

* **IN**: (storeKey, initialState)
  - storeKey:     string
  - initialState: non-null, non-undefined

* **OUT**: [useSubscription, update, addReducers, inspect]

#### useSubscription
```jsx
let [useSubscription] = useReduxState(storeKey, initialState)
useSubscription() => current state
```
  - **OUT**: current state
  - **REQUIRED**: must be called within a Component's render function
  - **EFFECT**:
    - Establishes a subscription for any component that uses it. The component will re-render whenever `update` is called, and `useSubscription` will return the latest, updated value within that render.
    - Internally, useSubscription is simply:<br>`useSelector(state => state[storeKey])`<br>see: https://react-redux.js.org/next/api/hooks for details.

#### update
```jsx
let [__, update] = useReduxState(storeKey, initialState)
update(updateState) => dispatched action (Object)
```

  - **IN**: reducer(function) or non-null/undefined
    - *reducer(function):* `reducer = updateState == (currentState) => nextState`
    - *non-null/undefined:* `reducer = () => updateState`

  - **OUT**: same as redux's store.dispatch: https://redux.js.org/api/store#dispatchaction
  - **EFFECT**: dispatches a redux update as defined by the updateState parameter.

#### addReducers
```jsx
let [__, __, addReducers] = useReduxState(storeKey, initialState)
addReducers(reducers) => dispatchers
```

  - **IN**: reducers: object mapping action names to reducers
    - e.g. `{myAction: (state, payload) => newState}`

  - **OUT**: dispatchers: object mapping action names to dispatchers
    - e.g. `{myAction: (payload) => dispatch('myAction', payload)`
  - **EFFECT**: adds reducers for your useReduxState

#### inspect
```jsx
let [__, __, __, inspect] = useReduxState(storeKey, initialState)
inspect() => {reducers, state}
```
  - **OUT**: the current reducers and current state for your useReduxState

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

Call setStore to provide manually create your own store for hooks-for-redux to use. You'll need to use this if you want to use middleware.

* **IN**:   any redux store supporting .injectReducer
* **OUT**:  the store passed in
* **REQUIRED**:
  - can only be called once
  - must be called before getStore or useReduxState


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
If you want to provide your own redux store, you'll need to implement injectReducer.

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

## Produced By

hooks-for-redux was [developed in JavaScript for React and Redux at GenUI.co](https://www.genui.co).