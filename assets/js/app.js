import { Socket } from 'phoenix'

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

const serverSocket = new Socket('/server_socket', { params: { application_name: "Test", token: 'server_dev' } })

serverSocket.connect()

const serverChannel = serverSocket.channel('server:Test', {})

serverChannel.join()
  .receive('ok', () => console.log('server connected'))
  .receive('timeout', () => console.log('Networking issue. Still waiting...'))

window.clientChannel = channel;
window.serverChannel = serverChannel;
