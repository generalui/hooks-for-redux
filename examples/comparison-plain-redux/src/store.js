import {createStore, combineReducers} from 'redux'
import greeting from './greetingReducer'

const store = createStore(combineReducers({
  greeting
}));

export default store