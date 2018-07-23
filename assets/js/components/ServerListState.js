import React, { Component, createContext } from 'react'
import { Presence } from 'phoenix'

export const ServerListStateContext = createContext([])

// https://sashat.me/2017/01/11/list-of-20-simple-distinct-colors/
const distinctGraphingColors = [
  '#3cb44b', // green
  '#800000', // maroon
  '#0082c8', // blue
  '#f58231', // orange
  '#911eb4', // purple
  '#e6194b', // red
  '#46f0f0', // cyan
  '#f032e6', // magenta
  '#d2f53c', // lime
  '#fabebe', // pink
  '#008080', // teal
  '#e6beff', // lavender
  '#aa6e28', // brown
  '#fffac8', // beige
  '#ffe119', // yellow
  '#aaffc3', // mint
  '#808000', // olive
  '#ffd8b1', // coral
  '#000080', // navy
  '#808080', // grey
  '#000000', // black
]

const distinctGraphingColorsLength = distinctGraphingColors.length

export default class ServerListState extends Component {
  state = {
    // Phoenix presence is a list of servers
    presences: {},

    // Color cache must be kept here due to state updating dependencies
    colorCache: {},
    currentColorIndex: 0,

    selectedServerIds: [],
  }

  componentWillMount() {
    const { channel } = this.props;

    channel.on("presence_state", state => {
      const presences = Presence.syncState(this.state.presences, state)
      const {colorCache, currentColorIndex} = this.getNewColorCache(presences)
      this.setState({ presences: presences, colorCache, currentColorIndex })
    })

    channel.on("presence_diff", diff => {
      const presences = Presence.syncDiff(this.state.presences, diff)
      const {colorCache, currentColorIndex} = this.getNewColorCache(presences)
      this.setState({ presences: presences, colorCache, currentColorIndex })
    })
  }

  componentWillUnmount() {
    this.props.channel.off("presence_state")
    this.props.channel.off("presence_diff")
  }

  getColor = (serverId) => (
    this.state.colorCache[serverId]
  )

  getNewColorCache(presences) {
    const { colorCache, currentColorIndex } = this.state
    const servers = this.getServersFromPresences(presences)

    return servers.reduce(({colorCache, currentColorIndex}, { server_id }) => {
      if (colorCache[server_id]) {
        return {colorCache, currentColorIndex}
      }

      const newColorCache = {
        ...colorCache,
        [server_id]: distinctGraphingColors[currentColorIndex % distinctGraphingColorsLength]
      }

      return {colorCache: newColorCache, currentColorIndex: currentColorIndex + 1}
    }, {colorCache, currentColorIndex})
  }

  getServersFromPresences(presences) {
    let servers = []
    if (presences && presences.servers) {
      servers = presences.servers.metas
    }
    return servers
  }

  setServerSelected = (serverId, selected) => {
    const { selectedServerIds } = this.state

    if (selected) {
      this.setState({
        selectedServerIds: [serverId].concat(selectedServerIds)
      })
    } else {
      this.setState({
        selectedServerIds: selectedServerIds.filter((id) => id !== serverId)
      })
    }
  }

  render() {
    const { presences, selectedServerIds } = this.state
    const servers = this.getServersFromPresences(presences)
    const value = {
      getColor: this.getColor,
      setServerSelected: this.setServerSelected,
      servers,
      selectedServerIds
    }

    return (
      <ServerListStateContext.Provider value={value}>
        {this.props.children}
      </ServerListStateContext.Provider>
    )
  }
}
