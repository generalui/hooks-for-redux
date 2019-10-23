// index.js
import React from 'react';
import renderer from 'react-test-renderer';
import { Provider, useRedux, getStore } from '../../index'

const [subscribeToName, {toggleName, mrName, updateName, getState, getReducers}] = useRedux('name', 'Alice', {
  toggleName: (name) => name == 'Alice' ? 'Bob' : 'Alice',
  mrName: (name) => name == 'Alice' ? 'Mrs Alice' : 'Mr Bob',
  updateName: (name, newName) => newName
})

const getName = () => getStore().getState().name
const expectNameToEqual = (expected) => expect(getName()).toEqual(expected);

const App = () =>
  <p>Hello there, {subscribeToName()}! Click to change me.</p>

it('subscribeToName works', () => {
  updateName("Alice")
  const component = renderer.create(<Provider><App/></Provider>);
  expect(component.toJSON()).toMatchSnapshot();

  renderer.act(() => {updateName("Shane");})
  expect(component.toJSON()).toMatchSnapshot();
  component.unmount()
});

it('updateName(newState) works', () => {
  updateName("Al");
  expectNameToEqual("Al");
});

it('toggleName from addReducers works', () => {
  updateName("Alice")
  toggleName();
  expectNameToEqual("Bob");
});

it('mrName from addReducers works', () => {
  updateName("Alice")
  mrName();
  expectNameToEqual("Mrs Alice");
});

it('store methods', () => {
  expect(getState().constructor).toEqual(String)
  expect(getReducers().constructor).toEqual(Object)
})

it('getStore', () => {
  expect(getStore().getState().constructor).toEqual(Object)
  expect(typeof getStore().getState().name).toEqual("string")
  expect(typeof getStore().injectReducer).toEqual("function")
})