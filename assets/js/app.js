import { Socket } from 'phoenix'
import React from 'react'
import ReactDOM from 'react-dom'

import { decryptPayload } from './encryption'
import { allSystemStats } from './commands'
import App from './containers/app'

const socket = new Socket('/client_socket', { params: { token: 'dev' } })

socket.onError(() => {
  console.log("there was an error with the connection!")
})

socket.onClose(() => {
  console.log("the connection dropped")
})

socket.connect()

const channel = socket.channel('client', {})

channel.join()
  .receive('ok', () => console.log('connected'))
  .receive('timeout', () => console.log('Networking issue. Still waiting...'))

channel.on('collect_results', (evt) => {
  const decrypted = decryptPayload(evt.encrypted_response);
  let payload;

  if (decrypted.startsWith('stats|')) {
    payload = JSON.parse(decrypted.replace('stats|', ''))
  }

  console.log('[client] collect_results', evt, 'payload=', payload)
})

window.connectedServers = () => {
  channel.push("connected_servers", {})
    .receive('ok', (data) => console.log('connected_servers', data.connected_servers))
}

window.applicationNames = () => {
  channel.push("application_names", {})
    .receive('ok', (data) => console.log('application_names', data.application_names))
}
window.dispatchTestCommand = ({ application_name = "Test" }) => {
  channel.push("dispatch_command", Object.assign({
    application_name
  }, allSystemStats()))
}

ReactDOM.render(
  <App channel={channel} />,
  document.getElementById('react-app')
);
