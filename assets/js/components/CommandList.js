import React from 'react'

import { CommandHistoryStateContext } from './CommandHistoryState'
import { CollectorStateContext } from './CollectorState'
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

function confirmDeletion(doDelete) {
  if (window.confirm('Are you sure you wish to clear this data?')) {
    doDelete()
  }
}

export default ({ channel, selectedApplicationNames }) => (
<CollectorStateContext.Consumer>
  {
    ({ clearData }) => (
      <CommandHistoryStateContext.Consumer>
      {
        ({ addHistory }) => (
          <div>
            <button onClick={dispatchCommand(channel, selectedApplicationNames, addHistory, allSystemStats, 'Server Stats')}>Server Stats</button>
            <button onClick={dispatchCommand(channel, selectedApplicationNames, addHistory, processCountStats, 'Process Counts')}>Process Counts</button>
            <button onClick={() => confirmDeletion(clearData)}>Clear Charts</button>
          </div>
        )
      }
      </CommandHistoryStateContext.Consumer>
    )
  }
</CollectorStateContext.Consumer>
)
