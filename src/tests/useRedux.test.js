// index.js
import React from 'react';
import renderer from 'react-test-renderer';
import { Provider, useRedux, getStore } from '../../index'

describe("basic mode",() => {
  const STORE_KEY = 'basicModeName';
  const [subscribeToName, updateName, {getState}] = useRedux(STORE_KEY, 'Alice')

  const expectNameToEqual = (expected) => expect(getState()).toEqual(expected);

  it('updateName(newState) works', () => {
    updateName("Al");
    expectNameToEqual("Al");
  });

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

  it('getState', () => {
    expect(typeof getState()).toEqual("string")
    expect(getState()).toEqual(getStore().getState()[STORE_KEY])
  })
})

describe("reducers mode",() => {
  const STORE_KEY = 'reducerModeName';
  const [subscribeToName, {toggleName, mrName, updateName, getState, getReducers}] = useRedux(STORE_KEY, 'Alice', {
    toggleName: (name) => name == 'Alice' ? 'Bob' : 'Alice',
    mrName: (name) => name == 'Alice' ? 'Mrs Alice' : 'Mr Bob',
    updateName: (name, newName) => newName
  })

  const expectNameToEqual = (expected) => expect(getState()).toEqual(expected);

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

  it('getReducers', () => {
    expect(getReducers().constructor).toEqual(Object)
  })

  it('getState', () => {
    expect(typeof getState()).toEqual("string")
    expect(getState()).toEqual(getStore().getState()[STORE_KEY])
  })

  it('getStore', () => {
    expect(typeof getStore().injectReducer).toEqual("function")
  })
})