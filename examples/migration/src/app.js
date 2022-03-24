import {setStore, createStore, createReduxModule} from 'hooks-for-redux'

// Current reducer used in your app
const reducers = (state, action) => {
    switch (action.type) {
        case 'INCREMENT_COUNT':
            return {...state, count: (state.count || 42) + 1}
        case 'DECREMENT_COUNT':
            return {...state, count: (state.count || 42) - 1}
        default:
            return state
  }
}

// Set store with H4R
const store = setStore(createStore(reducers))

// Add existing state slice with H4R (slice will be changeable with dispatch and H4R hooks)
const [useCount, {increment, decrement}] = createReduxModule('count', 42, {
    increment: (state) => state + 1,
    decrement: (state) => state - 1,
})

// Add non-existing state slice with H4R (slice will be changeable with H4R hooks)
const [useName, {setName}] = createReduxModule('name', 'Marty', {
    setName: (state, name) => name || 'Marty',
})

let render = () => { 
    console.log(store.getState())
    document.getElementById('count-state').innerHTML = store.getState().count
    document.getElementById('name-state').innerHTML = store.getState().name
}

store.subscribe(render)

// Change count using dispatch
document
    .getElementById('increment-dispatch')
    .addEventListener('click', () => store.dispatch({type: 'INCREMENT_COUNT'}))

// Change count using hook
document
    .getElementById('decrement-hook')
    .addEventListener('click', decrement)

// Change name using hook
document
    .getElementById('name-input')
    .addEventListener('keyup', (e) => setName(e.target.value))

render()
