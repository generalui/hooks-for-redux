// index.js
import React from 'react';
import renderer from 'react-test-renderer';
import { Provider } from '../../index'

import {subscribeToName, updateName} from './NameHook.js'

const App = () =>
  <p onClick={
    () => updateName((name) => name == 'Alice' ? 'Bob' : 'Alice')
  }>
    Hello there, {subscribeToName()}! Click to change me.
  </p>

it('renders without crashing', () => {
  const component = renderer.create(
    <Provider>
    <App />
    </Provider>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  renderer.act(() => (updateName("Shane"),undefined))
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
