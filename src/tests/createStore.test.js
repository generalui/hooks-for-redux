import renderer from 'react-test-renderer';
const { combineReducers } = require('redux')
import { Provider, setStore, getStore, createStore, createReduxModule } from "../index";

describe("support default createStore API", () => {

  const reducer = (state, action) => {
      switch (action.type) {
        case 'INCREMENT_COUNT':
          return {...state, count: (state.count || 0) + 1}
        default:
          return state
    }
  }

  const store = setStore(createStore(reducer))

  const [useCount, {increment, decrement}] = createReduxModule('count', 5, {
    increment: (state) => state + 1,
    decrement: (state) => state - 1,
  }, store)

  const [useMessage, {setMessage}] = createReduxModule('message', 'Hello!', {
    setMessage: (state, message) => message,
  }, store)

  it("initialize state", () => {
    expect(store.getState().count).toEqual(5)
    expect(store.getState().message).toEqual('Hello!')
  })

  it("increment count with dispatch", () => {
    renderer.act(() => {store.dispatch({type: 'INCREMENT_COUNT'})})
    expect(store.getState().count).toEqual(6);
  })

  it("increment count with hook", () => {
    renderer.act(() => {increment()})
    expect(store.getState().count).toEqual(7);
  })

  it("set message with hook", () => {
    renderer.act(() => {setMessage('Goodbye!')})
    expect(store.getState().message).toEqual('Goodbye!');
  })
});


describe("support default createStore API with combined reducers", () => {

  const countReducer = (state = 0, action) => {
    switch (action.type) {
      case 'INCREMENT_COUNT':
        return state + 1
      default:
        return state
    }
  }

  const messageReducer = (state = 'Hello!', action) => {
    switch (action.type) {
      case 'SET_MESSAGE':
        return state = action.payload
      default:
        return state
    }
  }

  const combinedReducer = combineReducers({count: countReducer, message: messageReducer})
  const store = createStore(combinedReducer)

  const [useCount, {increment, decrement}] = createReduxModule('count', 5, {
    increment: (state) => state + 1,
    decrement: (state) => state - 1,
  }, store)

  it("initialize state", () => {
    // Initial state set with createReduxModule is not applied if reducer already exists
    expect(store.getState().count).toEqual(0)
    expect(store.getState().message).toEqual('Hello!')
  })

  it("increment count with dispatch", () => {
    renderer.act(() => {store.dispatch({type: 'INCREMENT_COUNT'})})
    expect(store.getState().count).toEqual(1);
  })

  it("set message with dispatch", () => {
    renderer.act(() => {store.dispatch({type: 'SET_MESSAGE', payload: 'Goodbye!'})})
    expect(store.getState().message).toEqual('Goodbye!');
  })

  it("increment count with hook", () => {
    renderer.act(() => {increment()})
    expect(store.getState().count).toEqual(2);
  })
});

it("injectReducer key must be unique", () => {
  getStore().injectReducer("myKey", () => 1);
  getStore().injectReducer("myKey", () => 2); // second call OK
});
