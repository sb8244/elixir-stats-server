import React, { Component, createContext } from 'react'
import { Presence } from 'phoenix'

export const CommandHistoryStateContext = createContext({})

export default class CommandHistoryState extends Component {
  state = {

  }

  addHistory({ commandId, commandTitle }) {
    this.setState({
      [commandId]: commandTitle
    })
  }

  getTitle(commandId) {
    return this.state[commandId]
  }

  render() {
    const value = {
      history: this.state,
      addHistory: this.addHistory.bind(this),
      getTitle: this.getTitle.bind(this)
    }

    return (
      <CommandHistoryStateContext.Provider value={value}>
        {this.props.children}
      </CommandHistoryStateContext.Provider>
    )
  }
}
