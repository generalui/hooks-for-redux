// NameHook.js
import {useReduxState} from '../index'

const [subscribeToName, updateName] = useReduxState('name', 'Alice')
export {subscribeToName, updateName}
