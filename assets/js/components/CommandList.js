import React from 'react'

import { CommandHistoryStateContext } from './CommandHistoryState'
import { allSystemStats, processCountStats } from '../commands'

function dispatchCommand(channel, selectedApplicationNames, addHistory, commandGenerator, commandTitle) {
  return () => {
    selectedApplicationNames.forEach((applicationName) => {
      const command = Object.assign({
        application_name: applicationName
      }, commandGenerator())

      channel.push("dispatch_command", command)
      addHistory({ commandId: command.command_id, commandTitle })
    })
  }
}

export default ({ channel, selectedApplicationNames }) => (
  <CommandHistoryStateContext.Consumer>
  {
    ({ addHistory }) => (
      <div>
        <button onClick={dispatchCommand(channel, selectedApplicationNames, addHistory, allSystemStats, 'Server Stats')}>Server Stats</button>
        <button onClick={dispatchCommand(channel, selectedApplicationNames, addHistory, processCountStats, 'Process Counts')}>Process Counts</button>
      </div>
    )
  }
  </CommandHistoryStateContext.Consumer>
)
