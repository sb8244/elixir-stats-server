import React, { Component, createContext } from 'react'
import { Presence } from 'phoenix'

export const ServerColorStateContext = createContext([])

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

export default class ServerColorState extends Component {
  state = {
    colorCache: {},
    currentColorIndex: 0
  }

  getColor = (serverId) => {
    if (!this.state.colorCache[serverId]) {
      const { colorCache, currentColorIndex } = this.state

      this.setState({
        colorCache: {
          ...colorCache,
          [serverId]: distinctGraphingColors[currentColorIndex % distinctGraphingColorsLength]
        },
        currentColorIndex: currentColorIndex + 1
      })
    }

    return this.state.colorCache[serverId]
  }

  render() {
    const value = {
      getColor: this.getColor
    }

    return (
      <ServerColorStateContext.Provider value={value}>
        {this.props.children}
      </ServerColorStateContext.Provider>
    )
  }
}
