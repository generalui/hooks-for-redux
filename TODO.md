
# "Pure" API: addReducers

We could create an API that avoided putting functions in the dispatch object. It would also make the dispatch object's 'type' more descriptive (derived from the key of each field passed to addReducers).

```js
const [useSubscription, update, addReducers] = useReduxState("items", [])

const {addItem} = addReducers({
  addItem:    (items, item) => [...items, item],
})
// addItem = (item) => dispatch-response
```

# Simplified Provider

Instead of:
```js
import { getStore } from 'hooks-for-redux';
import { Provider } from 'react-redux'

<Provider store={getStore()}>
  ...
</Provider>
```

Why not:
```js
import { Provider } from 'hooks-for-redux';

<Provider>
  ...
</Provider>
```
