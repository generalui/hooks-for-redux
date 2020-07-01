// index.js
import React from 'react';
import renderer from 'react-test-renderer';
import { Provider, createReduxModule, getStore } from '../../index'

describe("basic mode",() => {
  const STORE_KEY = 'basicModeName';
  const [subscribeToName, updateName, {getState}] = createReduxModule(STORE_KEY, 'Alice')

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
  const [subscribeToName, {toggleName, mrName, updateName}, {getState, getReducers}] = createReduxModule(STORE_KEY, 'Alice', {
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

  it('getState', () => {
    expect(typeof getState()).toEqual("string")
    expect(getState()).toEqual(getStore().getState()[STORE_KEY])
  })

  it('getStore', () => {
    expect(typeof getStore().injectReducer).toEqual("function")
  })
})

describe("subcriptions outside react", () => {
  const STORE_KEY = "createReduxModule testCounter";
  const [
    useName,
    { increment },
    { getState, getReducers, subscribe }
  ] = createReduxModule(STORE_KEY, 0, {
    increment: v => v + 1
  });

  it("subscribe", () => {
    let lastValueSeen = getState();
    let firstValueSeen = lastValueSeen;
    const unsubscribe = subscribe(newValue => {
      expect(newValue).toEqual(lastValueSeen + 1);
      lastValueSeen = newValue;
    });
    increment();
    expect(lastValueSeen).toEqual(firstValueSeen + 1);
    unsubscribe();
    increment();
    expect(lastValueSeen).toEqual(firstValueSeen + 1);
  });
});


describe("duplicate action names", () => {
  const [useCountA, { increment: incrementCountA }, { getState: getCountAState }] = createReduxModule("count-a", 0, {increment: v => v + 1});
  const [useCountB, { increment: incrementCountB }, { getState: getCountBState }] = createReduxModule("count-b", 0, {increment: v => v + 1});

  it("doesn't interfere", () => {
    expect(getCountAState()).toEqual(0);
    expect(getCountBState()).toEqual(0);
    incrementCountA()
    expect(getCountAState()).toEqual(1);
    expect(getCountBState()).toEqual(0);
  })

});
