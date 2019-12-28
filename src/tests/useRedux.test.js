// index.js
import React from 'react';
import renderer from 'react-test-renderer';
import { useRedux, getStore } from '../../index'

describe("basic mode", () => {
  const setup = () => {
    const STORE_KEY = 'basicModeName';
    const [useName, updateName, { getState }] = useRedux(STORE_KEY, 'Alice')

    const expectNameToEqual = (expected) => expect(getState()).toEqual(expected);
    return { STORE_KEY, useName, updateName, expectNameToEqual, getState }
  }

  it('updateName(newState) works', () => {
    const { updateName, expectNameToEqual } = setup()
    updateName("Al");
    expectNameToEqual("Al");
  });


  it('useName works', () => {
    const { useName, updateName } = setup()
    const App = () =>
      <p>Hello there, {useName()}! Click to change me.</p>

    updateName("Alice")
    const component = renderer.create(<App />);
    expect(component.toJSON()).toMatchSnapshot();

    renderer.act(() => { updateName("Shane") })
    expect().toMatchSnapshot();
    component.unmount()
  });

  it('getState', () => {
    const { getState, STORE_KEY } = setup()
    expect(typeof getState()).toEqual("string")
    expect(getState()).toEqual(getStore().getState()[STORE_KEY])
  })
})

describe("reducers mode", () => {
  const setup = () => {
    const STORE_KEY = 'reducerModeName';
    const [useName, { toggleName, mrName, updateName }, { getState }] = useRedux(STORE_KEY, 'Alice', {
      toggleName: (name) => name == 'Alice' ? 'Bob' : 'Alice',
      mrName: (name) => name == 'Alice' ? 'Mrs Alice' : 'Mr Bob',
      updateName: (name, newName) => newName
    })

    const expectNameToEqual = (expected) => expect(getState()).toEqual(expected);

    const App = () =>
      <p>Hello there, {useName()}! Click to change me.</p>
    return { STORE_KEY, useName, toggleName, mrName, updateName, getState, App, expectNameToEqual }
  }

  it('useName works', () => {
    const { updateName, App } = setup()
    updateName("Alice")
    const component = renderer.create(<App />);
    expect(component.toJSON()).toMatchSnapshot();

    renderer.act(() => { updateName("Shane"); })
    expect(component.toJSON()).toMatchSnapshot();
    component.unmount()
  });

  it('updateName(newState) works', () => {
    const { updateName, expectNameToEqual } = setup()
    updateName("Al");
    expectNameToEqual("Al");
  });

  it('toggleName from addReducers works', () => {
    const { updateName, toggleName, expectNameToEqual } = setup()
    updateName("Alice")
    toggleName();
    expectNameToEqual("Bob");
  });

  it('mrName from addReducers works', () => {
    const { updateName, mrName, expectNameToEqual } = setup()
    updateName("Alice")
    mrName();
    expectNameToEqual("Mrs Alice");
  });

  it('getState', () => {
    const { getState, STORE_KEY } = setup()
    expect(typeof getState()).toEqual("string")
    expect(getState()).toEqual(getStore().getState()[STORE_KEY])
  })

  it('getStore', () => {
    expect(typeof getStore().injectReducer).toEqual("function")
  })
})

describe("subscriptions outside react", () => {

  it("subscribe", () => {
    const STORE_KEY = "useRedux testCounter";
    const [
      useName,
      { increment },
      { getState, subscribe }
    ] = useRedux(STORE_KEY, 0, {
      increment: v => v + 1
    });
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


describe("regression - function state values", () => {
  const setup = () => {
    const filterTypes = {
      all: () => true,
      completed: t => t.completed,
      active: t => !t.completed
    }

    const STORE_KEY = 'filter';
    const [useFilter, { setFilter }, { getState }] =
      useRedux(STORE_KEY, filterTypes.all, {
        setFilter: (__, filter) => filterTypes[filter] || filterTypes.all
      })

    const expectNameToEqual = (expected) => expect(getState()).toEqual(expected);

    const App = () =>
      <p>Filter: {useFilter().toString()}</p>
    return { STORE_KEY, useFilter, setFilter, getState, App, expectNameToEqual }
  }

  it('useFilter works', () => {
    const { setFilter, App } = setup()
    setFilter("active")
    const component = renderer.create(<App />);
    expect(component.toJSON()).toMatchSnapshot();

    renderer.act(() => { setFilter("completed"); })
    expect(component.toJSON()).toMatchSnapshot();
    component.unmount()
  });
})