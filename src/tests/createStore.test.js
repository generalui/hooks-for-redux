import renderer from 'react-test-renderer';
import { Provider, setStore, getStore, createStore, createReduxModule } from "../index";

describe("support default createStore API", () => {

  const reducer = (state = { count: 0 }, action) => {
      switch (action.type) {
        case 'INCREMENT_COUNT':
          return {...state, count: (state.count || 0) + 1}
        default:
          return state
    }
  }

  const store = setStore(createStore(reducer))

  const [useCount, {incrementCount}] = createReduxModule('count', 0, {
    incrementCount: (state) => state + 1,
  })

  const [useMessage, {setMessage}] = createReduxModule('message', 'Hello!', {
    setMessage: (state, message) => message,
  })

  it("initialize state", () => {
    expect(store.getState().count).toEqual(0);
    expect(store.getState().message).toEqual('Hello!');
  })

  it("increment count with hook", () => {
    renderer.act(() => {incrementCount()})
    expect(store.getState().count).toEqual(1);
  })

  it("increment count with dispatch", () => {
    renderer.act(() => {store.dispatch({type: 'INCREMENT_COUNT'})})
    expect(store.getState().count).toEqual(2);
  })

  it("set slice which is not part of initial state", () => {
    renderer.act(() => {setMessage('Goodbye!')})
    expect(store.getState().message).toEqual('Goodbye!');
  })
});

it("injectReducer key must be unique", () => {
  getStore().injectReducer("myKey", () => 1);
  getStore().injectReducer("myKey", () => 2); // second call OK
});