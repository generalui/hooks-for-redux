# v1.3.0

* NEW: `createReduxModule` - same API as useRedux, but new name.

> We changed the name so as to not erroneously trigger the React warning: https://reactjs.org/warnings/invalid-hook-call-warning.html. It's also a better name.

* DEPRECATED: `useRedux` - use `createReduxModule` instead (same API!)
