import React, { Component } from 'react'
import { Socket } from 'phoenix'

import { fetchCredentials } from '../credentials'

export default class SocketComponent extends Component {
  state = {
    socket: null,
    channel: null,
    credentials: fetchCredentials()
  }

  componentDidMount() {
    this.setupSocket()
  }

  setupSocket() {
    if (this.state.socket) {
      return
    }

    const { credentials } = this.state

    const socket = new Socket('/client_socket', { params: { token: credentials.socketConnectSecret } })
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

    this.setState({
      socket,
      channel
    })
  }

  render() {
    console.log(this.state)

    if (this.state.channel) {
      return this.props.render(this.state)
    } else {
      return (
        <div>

        </div>
      )
    }
  }
}
