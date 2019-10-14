```jsx
// Name.js
import {useReduxState} from 'hooked-on-redux'

const [subscribeToName, updateName] = useReduxState('Alice')
export {subscribeToName, updateName}

// Component.jsx
import React from 'react';
import {subscribeToName, updateName} from './Name.js'

function Component = (props) => {
  const name = subscribeToName()
  return
    <p onClick={
      () => updateName(name == 'Alice' ? 'Bob' : 'Alice')
    }>
      Hello there, {name}! Click to change me.
    </p>
}

export.default Component;
```