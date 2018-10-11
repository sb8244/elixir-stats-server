import React, { Component, createContext } from 'react'

export const CommandArgumentStateContext = createContext({})

const LOCAL_STORAGE_ARGUMENT_MAP_KEY = 'CommandArgumentState.argumentMap'

function getInitialArgumentMap() {
  const localState = localStorage.getItem(LOCAL_STORAGE_ARGUMENT_MAP_KEY)

  if (localState) {
    return JSON.parse(localState)
  } else {
    return {
      processList: [
        { key: 'count', value: '10', id: 'default_count' },
        { key: 'by', value: 'memory', id: 'default_by' }
      ]
    }
  }
}

export default class CommandArgumentState extends Component {
  state = {
    argumentMap: getInitialArgumentMap(),
    showArguments: {}
  }

  setArguments(commandName) {
    return (argumentList) => {
      const { argumentMap } = this.state
      const newArgumentMap = {
        ...argumentMap,
        [commandName]: argumentList
      }

      this.setState({
        argumentMap: newArgumentMap
      })
      localStorage.setItem(LOCAL_STORAGE_ARGUMENT_MAP_KEY, JSON.stringify(newArgumentMap))
    }
  }

  toggleShowArguments(commandName) {
    const { showArguments } = this.state
    this.setState({
      showArguments: {
        ...showArguments,
        [commandName]: !showArguments[commandName]
      }
    })
  }

  render() {
    const value = {
      argumentMap: this.state.argumentMap,
      showArguments: this.state.showArguments,
      setArguments: this.setArguments.bind(this),
      toggleShowArguments: this.toggleShowArguments.bind(this)
    }

    return (
      <CommandArgumentStateContext.Provider value={value}>
        {this.props.children}
      </CommandArgumentStateContext.Provider>
    )
  }
}
