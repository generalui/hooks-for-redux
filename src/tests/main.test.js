// index.js
import React from 'react';
import renderer from 'react-test-renderer';
import { Provider, useReduxState, getStore } from '../../index'

const [subscribeToName, updateName] = useReduxState('name', 'Alice')
const toggleName = () => updateName((name) => name == 'Alice' ? 'Bob' : 'Alice')

const App = () =>
  <p onClick={toggleName}>
    Hello there, {subscribeToName()}! Click to change me.
  </p>

it('renders without crashing', () => {
  const component = renderer.create(
    <Provider>
      <App />
    </Provider>
  );
  expect(component.toJSON()).toMatchSnapshot();

  renderer.act(() => {updateName("Shane");})
  expect(component.toJSON()).toMatchSnapshot();
});

it('getStore', () => {
  expect(getStore().getState().constructor).toEqual(Object)
  expect(typeof getStore().getState().name).toEqual("string")
  expect(typeof getStore().injectReducer).toEqual("function")
})