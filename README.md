# hooks-for-redux

Wouldn't it be nice if you could use the elegant syntax of React-hooks when dealing with Redux?

# Examples

### Example-A
This is a *complete* redux + react application. Hooks-for-redux dramatically reduces the redux-specific code required to build your app.

Define your redux-hooks:
```jsx
// NameHook.js
import {useReduxState} from 'hooks-for-redux'

// One line is sufficient to define & initialize your redux hook:
// EFFECT: initializes store.name = 'Alice'
// OUT:
//  useNameSubscription:
//    Use this hook in your React renderer to subscribe to changes.
//  updateName:
//    Use to update store.name's value
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
// index.js
import React from 'react';
import { Provider } from 'react-redux';
import { getStore } from 'hooks-for-redux'
import App from './App'

ReactDOM.render(
  <Provider store={getStore()}>
    <App />
  </Provider>,
  document.getElementById('root')
);
```

### Example-B
Instead of returning the raw update function, you can build your own. Your code will be less brittle and more testable the more specific you cam make your transactional redux update functions. Example-A can be improved by only exporting the exact updates allowed by your redux-hook:

```jsx
// NameHook.js
import {useReduxState} from 'hooks-for-redux'

const [useNameSubscription, updateName] = useReduxState('name', 'Alice')
const toggleName = () =>
  updateName((name) => name == 'Alice' ? 'Bob' : 'Alice')
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

### API

#### useReduxState

In most cases, all you really need is useReduxState, as seen in the example above.

```jsx
useReduxState(storeKey, initialState) => [useSubscription, update]

IN:
  storeKey:     string
  initialState: non-null, non-undefined

OUT: [useSubscription, update]
  useSubscription: () => current state
    REQUIRED: must be called within a render function
    EFFECT:
      Will cause the Component to be re-rendered
      after update is called; when re-rendered, will
      return the latest state.

  update: (updateState) => update action
    IN: function or non-null/undefined
      if (function) (currentState) => nextState
      else nextState = updateState

    OUT: same as redux's store.dispatch (1)
```
1. https://redux.js.org/api/store#dispatchaction

#### getStore
```jsx
getStore() => store

IN:     nothing
OUT:    redux store
EFFECT:
  Auto-vivifies a store if setStore has not been called.
  Otherwise, it returns the store passed to setStore.
```

#### setStore

Call setStore to provide manually create your own store for hooks-for-redux to use. You'll need to use this if you want to use middleware.

```jsx
setStore(store) => store

IN:   any redux store supporting .injectReducer
OUT:  the store passed in
REQUIRED:
  - can only be called once
  - must be called before getStore or useReduxState
```

#### createStore

Create a basic redux store with injectReducer support.

```jsx
createStore(reducersMap, [preloadedState], [enhancer]) => store

IN:
  reducersMap:    object suitable for Redux.combineReducers (1)
  preloadedState: see Redux.createStore (2)
  enhancer:       see Redux.createStore (2)

OUT: redux store supporting .injectReducer
```
1. https://redux.js.org/api/combinereducers
1. https://redux.js.org/api/createstore

#### store.injectReducer

Hooks-for-redux requires a store that supports the injectReducer. You only need to worry about this if you are using setState to manually set your store *and* you are note using hooks-for-redux's own createStore function.

The injectReducer method is described here https://redux.js.org/recipes/code-splitting. It's signature looks like:

```jsx
store.injectReducer(reducerName, reducer) => ignored

IN:
  reducerName:  String
  reducer:      (current-reducer-named-state) => nextState

OUT:      ignored
EFFECT:   adds reducer to the reducersMaps passed in at creation time.
REQUIRED:
  {[reducerName]: reducer} should be suitable for React.combineReducers

```

> NOTE: Just as any other reducer passed to React.combineReducers, the reducer passed to injectReducer doesn't get passed the store's entire state. It only gets passed, and should return, its own state data which is stored in the top-level state under the provided reducerName.

