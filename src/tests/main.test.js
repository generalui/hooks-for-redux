// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';

import { getStore } from '../index'

import {subscribeToName, updateName} from './NameHook.js'

const App = () =>
  <p onClick={
    () => updateName((name) => name == 'Alice' ? 'Bob' : 'Alice')
  }>
    Hello there, {subscribeToName()}! Click to change me.
  </p>

it('renders without crashing', () => {
  // const div = document.createElement('div');
  const component = renderer.create(
    <Provider store={getStore()}>
    <App />
    </Provider>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
  renderer.act(() => (updateName("Shane"),undefined))
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();
  // ReactDOM.unmountComponentAtNode(div);
});
