import React, { Component, createContext } from 'react'
import { Presence } from 'phoenix'

export const ServerListStateContext = createContext([])

export default class ServerListState extends Component {
  constructor(props) {
    super(props)

    const { channel } = props;

    this.state = {
      presences: {}
    }

    channel.on("presence_state", state => {
      this.setState({ presences: Presence.syncState(this.state.presences, state) })
    })

    channel.on("presence_diff", diff => {
      this.setState({ presences: Presence.syncDiff(this.state.presences, diff) })
    })
  }

  componentWillUnmount() {
    this.props.channel.off("presence_state")
    this.props.channel.off("presence_diff")
  }

  render() {
    const { presences } = this.state

    let servers = []
    if (presences && presences.servers) {
      servers = presences.servers.metas
    }

    return (
      <ServerListStateContext.Provider value={servers}>
        {this.props.children}
      </ServerListStateContext.Provider>
    )
  }
}
