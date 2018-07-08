import { Socket } from 'phoenix'
import { encryptPayload, decryptPayload } from './encryption'

[
  "cHvxhUgY3E5io6J5VJD6Tg==--l+ejr1hNt6E7v7g5PTDzfg=="
].forEach((data) => {
  console.log(decryptPayload(data))
})

console.log(decryptPayload(encryptPayload('memory|530M')))

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
  console.log('[client] collect_results', evt)
})

const serverSocket = new Socket('/server_socket', { params: { application_name: "Test", token: 'server_dev' } })

serverSocket.connect()

const serverChannel = serverSocket.channel('server:Test', {})

serverChannel.join()
  .receive('ok', () => console.log('server connected'))
  .receive('timeout', () => console.log('Networking issue. Still waiting...'))

serverChannel.on('dispatch_command', (evt) => {
  console.log('[server] dispatch_command', evt)
  serverChannel.push('collect_results', {command_id: evt.command_id, encrypted_response: 'response', server_id: 'js test'})
})

window.clientChannel = channel;
window.serverChannel = serverChannel;
// clientChannel.push("dispatch_command", {application_name: "Test", command_id: "a", encrypted_command: "b"})
