import {SET_GREETING, RESET_GREETING} from './actions'
const DEFAULT_GREETING = "hello, vanilla redux";

const greeting = (state = DEFAULT_GREETING, action) => {
  switch (action.type) {
    case SET_GREETING:
      return action.payload;
    case RESET_GREETING:
      return DEFAULT_GREETING;
    default:
      return state;
  }
}
export default greeting