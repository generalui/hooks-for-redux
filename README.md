# <a href='https://github.com/generalui/hooks-for-redux'><img src='https://raw.githubusercontent.com/wiki/generalui/hooks-for-redux/h4r-logo-with-full-name.png' height='60' alt='Hooks-for-Redux Logo' aria-label='hooks-for-redux' /></a><br>hooks-for-redux (H4R)

> still redux, half the code, built to scale

[Redux](https://www.npmjs.com/package/redux) has many wonderful traits, but brevity isn't one of them. Verbose code is not only tedious to write, but it increases the chance of bugs.

Hooks-for-redux's goal is to reduce the amount of boilerplate code required to define and manage Redux state while maximizing capability and compatibility with the Redux ecosystem.

The primary strategy is to [DRY](https://www.essenceandartifact.com/2016_06_01_archive.html#dry) up the API and use reasonable defaults, with overrides, wherever possible. H4R streamlines reducers, actions, dispatchers, store-creation and hooks for React. In the same way that React added "hooks" to clean up Component state management, hooks-for-redux uses a similar, hooks-style API to clean up Redux state management.

The result is a elegant API with 2-3x reduction in client code and near total elimination of all the boilerplate code needed to use plain Redux.

> H4R implements the [Modular Redux Design Pattern](https://medium.com/@shanebdavis/modular-redux-a-design-pattern-for-mastering-scalable-shared-state-82d4abc0d7b3).

## Contents

1. [ Install ](#install)
1. [ Usage ](#usage)
1. [ Comparison ](#comparison)
1. [ Tutorial ](#tutorial)
1. [ API ](#api)
1. [ How it Works ](#how-it-works)
1. [ TypeScript ](#typescript)
1. [ Prior Work ](#prior-work)
1. [ Contribution ](#contribution)
1. [ License ](#license)
1. [ Produced at GenUI ](#produced-at-genui)

Additional resources:

* 1st blog post: [How I Eliminated Redux Boilerplate with Hooks-for-Redux](https://medium.com/@shanebdavis/how-i-eliminated-redux-boilerplate-with-hooks-for-redux-bd308d5abbdd)
* 2nd blog post: [The 5 Essential Elements of Modular Software Design](https://medium.com/@shanebdavis/the-5-essential-elements-of-modular-software-design-6b333918e543)
* 3rd blog post: [Modular Redux — a Design Pattern for Mastering Scalable, Shared State in React](https://medium.com/@shanebdavis/modular-redux-a-design-pattern-for-mastering-scalable-shared-state-82d4abc0d7b3)

Included Examples:

* [tiny](./examples/tiny) - the simplest working example
* [tiny-todo](./examples/tiny-todo) - a slightly more detailed example
* [middleware](./examples/middleware) - an example of how to use Redux middleware with H4R
* comparison [plain-redux](./examples/comparison-plain-redux) vs [hooks-for-redux](./examples/hooks-for-redux) - compare two, tiny working examples back-to-back

Advanced Examples:
* [todo with filters](https://github.com/shanebdavis/rtk-convert-todos-example-h4r-conversion) (try it now on [codesandbox.io](https://codesandbox.io/s/github/shanebdavis/rtk-convert-todos-example-h4r-conversion))
* [github-issues-browser](https://github.com/shanebdavis/rtk-github-issues-example-h4r-conversion) with typescript and asynchronous requests (try it now on [codesandbox.io](https://codesandbox.io/s/github/shanebdavis/rtk-github-issues-example-h4r-conversion))

## Install

```
npm install hooks-for-redux
```

## Usage

Tiny, complete example. See below for explanations.

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import {createReduxModule, Provider} from 'hooks-for-redux'

const [useCount, {inc, add, reset}] = createReduxModule('count', 0, {
  inc: (state) => state + 1,
  add: (state, amount) => state + amount,
  reset: () => 0
})

const App = () =>
  <p>
    Count: {useCount()}
    {' '}<input type="button" value="+1"    onClick={inc} />
    {' '}<input type="button" value="+10"   onClick={() => add(10)} />
    {' '}<input type="button" value="reset" onClick={reset} />
  </p>

ReactDOM.render(
  <Provider><App /></Provider>,
  document.getElementById('root')
);
```

- source: [examples/tiny](examples/tiny)

## Comparison

This is a quick comparison of a simple app implemented with both plain Redux and hooks-for-redux. In this example, 66% of redux-specific code was eliminated.

View the source:

- [comparison-plain-redux](examples/comparison-plain-redux)
- [comparison-hooks-for-redux](examples/comparison-hooks-for-redux)

This example is primarily intended to give a visual feel for how much code can be saved. Scroll down to learn more about what's going on.

![hooks-for-redux vs plain-redux comparison](https://raw.githubusercontent.com/wiki/generalui/hooks-for-redux/hooks-for-redux-comparison.png)

## Tutorial

#### Tutorial A: Use and Set

The core of hooks-for-redux is the `createReduxModule` method. There are two ways to call createReduxModule - with and without custom reducers. This first tutorial shows the first, easiest way to use hooks-for-redux.

> Concept: `createReduxModule` initializes redux state under the property-name you provide and returns an array, containing three things:
>
> 1. react-hook to access named-state
> 2. dispatcher-function to update that state
> 3. virtual store

First, you'll need to define your redux state.

```jsx
// NameReduxState.js
import { createReduxModule } from "hooks-for-redux";

//  - initialize redux state.name = 'Alice'
//  - export useCount hook for use in components
//  - export setCount to update state.name
export const [useCount, setCount] = createReduxModule("count", 0);
```

Use your redux state:

- add a "+" button that adds 1 to count
- useCount()
  - returns the current count
  - re-renders when count changes

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
import React from "react";
import { Provider } from "hooks-for-redux";
import App from "./App";

ReactDOM.render(
  <Provider>
    <App />
  </Provider>,
  document.getElementById("root")
);
```

And that's all you need to do! Now, let's look at a fuller tutorial with custom reducers.

#### Tutorial B: Custom Reducers

Instead of returning the raw update reducer, you can build your own reducers. Your code will be less brittle and more testable the more specific you can make your transactional redux update functions ('reducers').

> Concept: When you pass a reducer-map as the 3rd argument, createReduxModule returns set of matching map of dispatchers, one for each of your reducers.

This example adds three reducer/dispatcher pairs: `inc`, `dec` and `reset`.

```jsx
// NameReduxState.js
import { createReduxModule } from "hooks-for-redux";

export const [useName, { inc, add, reset }] = createReduxModule("count", 0, {
  inc: state => state + 1,
  add: (state, amount) => state + amount,
  reset: () => 0
});
```

Now the interface supports adding 1, adding 10 and resetting the count.

```jsx
// App.jsx
import React from "react";
import { useName, inc, add, reset } from "./NameReduxState.js";

export default () => (
  <p>
    Count: {useCount()} <input type="button" onClick={inc} value="+1" />{" "}
    <input type="button" onClick={() => add(10)} value="+10" />{" "}
    <input type="button" onClick={reset} value="reset" />
  </p>
);
```

> Use `index.js` from Example-A to complete this app.

#### Tutorial: Custom Middleware

You may have noticed none of the code above actually calls Redux.createStore(). H4R introduces the concept of a default store accessible via the included `getStore()` and `setStore()` functions. The first time `getStore()` is called, a new redux store is automatically created for you. However, if you want to control how the store is created, call `setStore()` and pass in your custom store before calling `getStore` or any other function which calls it indirectly including `createReduxModule` and `Provider`.

Below is an example of creating your own store with some custom middleware. It uses H4R's own createStore method which extends Redux's create store as required for H4R. More on that below.

```jsx
// store.js
import { setStore, createStore } from "hooks-for-redux";
import { applyMiddleware } from "redux";

// example middle-ware
const logDispatch = store => next => action => {
  console.log("dispatching", action);
  return next(action);
};

export default setStore(createStore({}, applyMiddleware(logDispatch)));
```

```jsx
// index.jsx
import React from "react";
import "./store"; // <<< import before calling createReduxModule or Provider
import { Provider } from "hooks-for-redux";
import App from "./App";

ReactDOM.render(
  <Provider>
    <App />
  </Provider>,
  document.getElementById("root")
);
```

> NOTE: You don't have to use hooks-for-redux's createStore, but setStore must be passed a store that supports the injectReducer method as described here: https://redux.js.org/api/combinereducers

#### Advanced Examples

If you are interested in seeing a more complicated example in TypeScript with asynchronous remote requests, please see:

* [ H4R vs Redux-Toolkit Advanced TypeScript Tutorial ](#h4r-vs-redux-toolkit-advanced-typescript-tutorial)

## API

### createReduxModule

```jsx
import {createReduxModule} from 'hooks-for-redux'
createReduxModule(reduxStorePropertyName, initialState) =>
  [useMyStore, setMyStore, virtualStore]

createReduxModule(reduxStorePropertyName, initialState, reducers) =>
  [useMyStore, myDispatchers, virtualStore]
```

Define a top-level property of the redux state including its initial value, all related reducers, and returns a react-hook, dispatchers and virtualStore.

- **IN**: (reduxStorePropertyName, initialState)

  - reduxStorePropertyName: string
  - initialState: non-null, non-undefined
  - reducers: object mapping action names to reducers
    - e.g. `{myAction: (state, payload) => newState}`

- **OUT**: [useMyStore, setMyStore -or- myDispatchers, virtualStore]
  - useMyStore: react hook returning current state
  - One of the following:
    - setMyStore: (newState) => dispatch structure
    - myDispatchers: object mapping action names to matching myDispatchers
  - virtualStore: object with API similar to a redux store, but just for the state defined in this createReduxModule call

#### useMyStore

```jsx
const [useMyStore] = createReduxModule(reduxStorePropertyName, initialState)
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
const [__, {myAction}] = createReduxModule(reduxStorePropertyName, initialState, {
  myAction: (state, payload) => state
})
myAction(payload) => {type: MyAction, payload}
```

- **IN**: payload - after dispatching, will arrive as the payload for the matching reducer
- **OUT**: {type, payload}
  - type: the key string for the matching reducer
  - payload: the payload that was passed in
  - i.e. same as plain redux's store.dispatch()

### virtualStore API

The virtual store is an object similar to the redux store, except it is only for the redux-state you created with createReduxModule. It supports a similar, but importantly different API from the redux store:

#### virtualStore.getState

```jsx
import {createReduxModule, getStore} from 'hooks-for-redux'
const [,, myVirtualStore] = createReduxModule("myStateName", myInitialState)
myVirtualStore.getState() =>
  getStore().getState()["myStateName"]
```

The getState method works exactly like a redux store except instead of returning the state of the entire redux store, it returns only the sub portion of that redux state defined by the createReduxModule call.

- **IN**: (nothing)
- **OUT**: your current state

#### virtualStore.subscribe

```jsx
import {createReduxModule, getStore} from 'hooks-for-redux'
const [,, myVirtualStore] = createReduxModule("myStateName", myInitialState)
myVirtualStore.subscribe(callback) => unsubscribe
```

- **IN**: callback(currentState => ...)
- **OUT**: unsubscribe()

The subscribe method works a little differently from a redux store. Like reduxStore.subscribe, it too returns a function you can use to unsubscribe. Unlike reduxStore.subscribe, the callback passed to virtualStore.subscribe has two differences:

1. callback is passed the current value of the virtualStore directly (same value returned by virtualStore.getState())
2. callback is _only_ called when virtualStore's currentState !== its previous value.

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

### Store Registry API

Getting started, you can ignore the store registry. It's goal is to automatically manage creating your store and making sure all your code has access. However, if you want to customize your redux store, it's easy to do (see the [custom middleware example](#example-custom-middleware) above).

#### getStore

```jsx
import {getStore} from 'hooks-for-redux'
getStore() => store
```

Auto-vivifies a store if setStore has not been called. Otherwise, it returns the store passed to setStore.

- **IN**: nothing
- **OUT** : redux store

#### setStore

```jsx
import {setStore} from 'hooks-for-redux'
setStore(store) => store
```

Call setStore to provide your own store for hooks-for-redux to use. You'll need to use this if you want to use middleware.

- **IN**: any redux store supporting .injectReducer
- **OUT**: the store passed in
- **REQUIRED**:
  - can only be called once
  - must be called before getStore or createReduxModule

#### createStore

```jsx
import {createStore} from 'hooks-for-redux'
createStore(reducersMap, [preloadedState], [enhancer]) => store
```

Create a basic redux store with injectReducer support. Use this to configure your store's middleware.

- **IN**

  - reducersMap: object suitable for Redux.combineReducers https://redux.js.org/api/combinereducers
  - **OPTIONAL**: preloadedState & enhancer: see Redux.createStore https://redux.js.org/api/createstore

- **OUT**: redux store supporting .injectReducer

#### store.injectReducer

```jsx
store.injectReducer(reducerName, reducer) => ignored
```

If you just want to use Redux's createStore with custom parameters, see the [Custom Middleware Example](#example-custom-middleware). However, if you want to go further and provide your own redux store, you'll need to implement `injectReducer`.

- **IN**:

  - reducerName: String
  - reducer: (current-reducer-named-state) => nextState

- **EFFECT**: adds reducer to the reducersMaps passed in at creation time.
- **REQUIRED**:
  - {[reducerName]: reducer} should be suitable for React.combineReducers https://redux.js.org/api/combinereducers

Hooks-for-redux requires a store that supports the injectReducer. You only need to worry about this if you are using setState to manually set your store _and_ you are note using hooks-for-redux's own createStore function.

The injectReducer method is described here https://redux.js.org/recipes/code-splitting. Its signature looks like:

> NOTE: Just as any other reducer passed to React.combineReducers, the reducer passed to injectReducer doesn't get passed the store's entire state. It only gets passed, and should return, its own state data which is stored in the top-level state under the provided reducerName.

## How it Works

Curious what's happening behind the scenes? This is a tiny library for all the capabilities it gives you. Below is a quick overview of what's going on.

> Note: All code-examples in this section are approximations of the actual code. Minor simplifications were applied for the purpose of instruction and clarity. See the latest [source](src/) for complete, up-to-date implementations.

#### Dependencies

To keep things simple, this library has only two dependencies: [redux](https://www.npmjs.com/package/redux) and [react-redux](https://www.npmjs.com/package/react-redux). In some ways, H4R is just a set of elegant wrappers for these two packages.

#### Store Registry

- source: [src/storeRegistry.js](src/storeRegistry.js)

You might notice when using hooks-for-redux, you don't have to manually create your store, nor do you need to reference your store explicitly anywhere in your application. [Redux recommends](https://redux.js.org/faq/store-setup#can-or-should-i-create-multiple-stores-can-i-import-my-store-directly-and-use-it-in-components-myself) only using one store per application. H4R codifies that recommendation and defines a central registry to eliminate the need to explicitly pass the store around.

The implementation is straight forward:

```jsx
let store = null;
const getStore = () => (store ? store : (store = createStore()));
const setStore = initialStore => (store = initialStore);
```

#### Provider

- source: [src/Provider.js](src/Provider.js)

H4R wraps the react-redux [Provider](https://react-redux.js.org/api/provider#provider), combining it with a default store from the store registry. It reduces a small, but significant amount of boilerplate.

```jsx
const Provider = ({ store = getStore(), context, children }) =>
  React.createElement(ReactReduxProvider, { store, context }, children);
```

#### createReduxModule

- source: [src/createReduxModule.js](src/createReduxModule.js)

The big win, however, comes from one key observation: if you are writing your own routing, you are doing it wrong. The same can be said for dispatching and subscriptions.

The `createReduxModule` function automates all the manual routing required to make plain Redux work. It inputs only the essential data and functions necessary to define a redux model, and it returns all the tools you need to use it.

The implementation of createReduxModule is surprisingly brief. Details are explained below:

```jsx
const createReduxModule = (storeKey, initialState, reducers, store = getStore()) => {
  /* 1 */ store.injectReducer(
    storeKey,
    (state = initialState, { type, payload }) =>
      reducers[type] ? reducers[type](state, payload) : state
  );

  return [
    /* 2 */ () => useSelector(storeState => storeState[storeKey]),
    /* 3 */ mapKeys(reducers, type => payload =>
      store.dispatch({ type, payload })
    ),
    /* 4 */ createVirtualStore(store, storeKey)
  ];
};
```

1. H4R's redux store uses the [injectReducer pattern recommended by Redux](https://redux.js.org/api/combinereducers) to add your reducers to the store. Because the reducers are defined as an object, routing is dramatically simplified. Instead of a huge switch-statement, reducer routing can be expressed as one line no matter how many reducers there are.
2. The returned React Hook wraps react-redux's [useSelector](https://react-redux.js.org/next/api/hooks#useselector), selecting your state.
3. The returned dispatchers object is generated from the reducers passed in. The `type` value is set from each key in reducers. The dispatchers themselves take a payload as input and return the standard result of Redux's [dispatch](https://redux.js.org/api/store#dispatchaction) function.
4. Last, a new virtual-store is created for your redux model. See below for details.

#### VirtualStore

- source: [src/VirtualStore.js](src/VirtualStore.js)

The VirtualStore object allows you to access your state, a value bound to the Redux store via your storeKey, as-if it were a Redux store. It is implemented, again, as simple wrappers binding the virtual store to the state defined in createReduxModule.

```jsx
const createVirtualStore = (store, storeKey) => {
  const /* 1 */ getState = () => store.getState()[storeKey];
  return {
    getState,
    /* 2 */ subscribe: f => {
      let lastState = getState();
      return store.subscribe(
        () => lastState !== getState() && f((lastState = getState()))
      );
    }
  };
};
```

1. `getState` wraps Redux's [getState](https://redux.js.org/api/store#getstate) and returns the state of your storeKey.
2. `subscribe` wraps Redux's [subscribe](https://redux.js.org/api/store#subscribelistener), but it provides some additional functionality:
   - It only calls `f` if your state changed (using a `!==` test). In Redux's subscribe, `f` is "called any time an action is dispatched" - which is extremely wasteful.
   - `f` is passed your current state, so you don't have to manually call getState.

## TypeScript

TypeScript support is provided in the library. Configuring the generics for H4R was tricky, particularly for the createReduxModule method. Please send feedback on how we can improve the typing.

- [hooks-for-redux type definition](index.d.ts)

## Prior Work

Several people have attempted to simplify Redux and/or make it act more like React hooks, but none have succeeded in providing a general-purpose, fully DRY solution.

- https://www.npmjs.com/package/edux
- https://www.npmjs.com/package/no-boilerplate-redux
- https://www.npmjs.com/package/reduxless
- https://www.npmjs.com/package/redux-actions
- https://www.npmjs.com/package/redux-arc
- https://www.npmjs.com/package/@finn-no/redux-actions
- https://www.npmjs.com/package/@mollycule/redux-hook
- https://www.npmjs.com/package/easy-peasy

### What about Redux Toolkit?

> Redux Toolkit: The official, opinionated, batteries-included tool set for efficient Redux development - https://redux-toolkit.js.org

Redux-Toolkit claims to be efficient, but when compared to H4R it still falls far short. I'll give an example.

#### H4R vs Redux-Toolkit Intermediate-Example
> 58% less code

Taking from the intermediate code-example provided in the Redux-Toolkit Package:

Redux-Toolkit's implementation:
* tutorial: [redux-toolkit.js.org](https://redux-toolkit.js.org/tutorials/intermediate-tutorial)
* interactive: [codesandbox.io](https://codesandbox.io/s/rtk-convert-todos-example-uqqy3)
* ~390 lines of JavaScript

I reduced the code by about 2x using H4R - including eliminating several files. Even the tests got simpler.

H4R solution
* interactive: [codesandbox.io](https://codesandbox.io/s/github/shanebdavis/rtk-convert-todos-example-h4r-conversion)
* source: [github](https://github.com/shanebdavis/rtk-convert-todos-example-h4r-conversion)
* ~160 lines of JavaScript

Here is a roughly apples-to-apples slice of the code from each project:

* [Redux Toolkit gist - 104 lines](https://gist.github.com/shanebdavis/9e67be8a0874a4c295001ba6e91f79e2)
* [Hooks-for-redux gist - 52 lines](https://gist.github.com/shanebdavis/ce02b4495f1bc0afa830796f58124604)

Part of the key is how well H4R links into React. Redux-toolkit takes 50 lines of code just to do this:

```javascript
import React from 'react'
import Todo from './Todo'
import { useFilters } from '../filters/filtersSlice'
import { useTodos } from './todosSlice'

export const VisibleTodoList = () =>
  <ul>
    {useTodos()
      .filter(useFilters())
      .map(todo => (
        <Todo key={todo.id} {...todo} />
      ))}
  </ul>
```

NOTE: The normal use of H4R is React-specific while Redux-Toolkit is agnostic to the rendering engine. Let me know if there is interest in non-react H4R support. It shouldn't be hard to do.

#### H4R vs Redux-Toolkit Advanced TypeScript Tutorial

> 48% less code

Now to take on a bigger challenge. The advanced tutorial is a capable github issue and issue-comment-browser. Even here, H4R shines. Redux-Toolkit has two main problems:

1. It still makes you manually dispatch your updates. H4R avoids making you manually create and dispatch your actions entirely by returning ready-to-use dispatchers. They just look like normal functions you can call to start your updates.
2. Redux-Toolkit's pattern mixes business-logic with view-logic. Redux-related code, particularly updates, should never be in the same files as view and view-logic files like components.

Blending UX-logic with business-logic creates excessive dependencies between modules. This dependency hell literally took me hours to unwind before I could convert it to H4R. Once I was done, though, it all simplified and became clear and easy to edit. If you open the code you will see that all the business logic in the H4R solution resides in the src/redux folder in *4 files and 100 lines of code - total*. All the components are clean and have zero business logic.

For example, compare the `IssueListPage.tsx` from each project:

```typescript
import React from 'react'
import { useIssues } from 'redux/issues'
import { RepoSearchForm } from './IssuesListLib/RepoSearchForm'
import { IssuesPageHeader } from './IssuesListLib/IssuesPageHeader'
import { IssuesList } from './IssuesListLib/IssuesList'
import { IssuePagination } from './IssuesListLib/IssuePagination'

export const IssuesListPage = () => {
  const { loading, error } = useIssues()
  return error
    ? <div>
      <h1>Something went wrong...</h1>
      <div>{error.toString()}</div>
    </div>
    : <div id="issue-list-page">
      <RepoSearchForm />
      <IssuesPageHeader />
      {loading ? <h3>Loading...</h3> : <IssuesList />}
      <IssuePagination />
    </div>
}
```

* [github/h4r/IssuesListPage](https://github.com/shanebdavis/rtk-github-issues-example-h4r-conversion/blob/master/src/components/pages/IssuesListPage.tsx)
* 21 lines, 693 bytes

to this:

* [github/redux-toolkit/IssuesListPage](https://github.com/reduxjs/rtk-github-issues-example/blob/master/src/features/issuesList/IssuesListPage.tsx)
* 87 lines, 2000 bytes

Redux-toolkit's solution mixes in the business logic of fetching the remote data. This is all handled by H4R's createReduxModule slices. Further, RT makes IssuesListPage dependent on many things such that it only passes to child-components but never uses itself - a false dependency. For example, the pagination details (currentPage, pageCount, etc...) should only be a dependency of IssuePagination.

Compare the full source of each project below:

Redux-Toolkit solution:
* tutorial: [redux-toolkit.js.org](https://redux-toolkit.js.org/tutorials/advanced-tutorial)
* interactive: [codesandbox.io](https://codesandbox.io/s/rtk-github-issues-example-02-issues-display-tdx2w)
* source: [github](https://github.com/reduxjs/rtk-github-issues-example)
* ~1170 lines of TypeScript

H4R solution:
* interactive: [codesandbox.io](https://codesandbox.io/s/github/shanebdavis/rtk-github-issues-example-h4r-conversion)
* source: [github](https://github.com/shanebdavis/rtk-github-issues-example-h4r-conversion)
* ~613 lines of TypeScript

## Contribution

If you have suggestions for improvement, please feel free to [start an issue on github](https://github.com/generalui/hooks-for-redux/issues).

## License

hooks-for-redux is [MIT licensed](./LICENSE).

## Produced at GenUI

hooks-for-redux was [developed in JavaScript for React and Redux at GenUI.co](https://www.genui.co).
