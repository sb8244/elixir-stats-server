import { Socket } from 'phoenix'
import { decryptPayload } from './encryption'
import { allSystemStats } from './commands'

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
  console.log('[client] collect_results', evt, 'decryptedResponse=', JSON.parse(decryptPayload(evt.encrypted_response)))
})

window.dispatchTestCommand = ({ application_name = "Test" }) => {
  channel.push("dispatch_command", Object.assign({
    application_name
  }, allSystemStats()))
}
