# v2.0.0

Dispatched action types are now qualified by their store key. Most people should see no difference. If you were previously relying on the implicit match across redux modules, your code may break.

# v1.3.0

* NEW: `createReduxModule` - same API as useRedux, but new name.

> We changed the name so as to not erroneously trigger the React warning: https://reactjs.org/warnings/invalid-hook-call-warning.html. It's also a better name.

* DEPRECATED: `useRedux` - use `createReduxModule` instead (same API!)
