import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'hooks-for-redux'
import './index.css'
import App from './App'

ReactDOM.render(<Provider><App/></Provider>, document.getElementById('root'));
