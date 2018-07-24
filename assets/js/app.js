import { createElement } from 'react'
import ReactDOM from 'react-dom'

import { hasFullCredentials } from './credentials'

import App from './containers/App'
import Login from './containers/Login'

import 'semantic-ui-css/semantic.min.css'

let container = App
if (!hasFullCredentials()) {
  container = Login
}

console.log(hasFullCredentials())
ReactDOM.render(
  createElement(container, null),
  document.getElementById('react-app')
);
