import React from 'react'

import { CommandHistoryStateContext } from './CommandHistoryState'
import { CollectorStateContext } from './CollectorState'
import { allSystemStats, processCountStats, processList } from '../commands'

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
    ({ clearData, clearPlainTextLogs }) => (
      <CommandHistoryStateContext.Consumer>
      {
        ({ addHistory }) => (
          <div className="command-list">
            <button onClick={dispatchCommand(channel, selectedApplicationNames, addHistory, allSystemStats, 'Server Stats')}>Server Stats</button>
            <button onClick={dispatchCommand(channel, selectedApplicationNames, addHistory, processCountStats, 'Process Counts')}>Process Counts</button>
            <button onClick={dispatchCommand(channel, selectedApplicationNames, addHistory, processList, 'Process List')}>Process List</button>
            <span className="command-list__vertical-break" />
            <button onClick={() => confirmDeletion(clearData)}>Clear Charts</button>
            <button onClick={() => confirmDeletion(clearPlainTextLogs)}>Clear Text Data</button>
          </div>
        )
      }
      </CommandHistoryStateContext.Consumer>
    )
  }
</CollectorStateContext.Consumer>
)
