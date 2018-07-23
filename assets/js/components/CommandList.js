import React from 'react'
import { Button } from 'semantic-ui-react'

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

export default ({ channel, selectedApplicationNames }) => {
  const disabled = selectedApplicationNames.length === 0

  return (
    <CollectorStateContext.Consumer>
      {
        ({ clearData, clearPlainTextLogs }) => (
          <CommandHistoryStateContext.Consumer>
          {
            ({ addHistory }) => (
              <div className="command-list-wrapper">
                <div className="command-list">
                  <Button disabled={disabled} basic fluid onClick={dispatchCommand(channel, selectedApplicationNames, addHistory, allSystemStats, 'Server Stats')}>Server Stats</Button>
                  <Button disabled={disabled} basic fluid onClick={dispatchCommand(channel, selectedApplicationNames, addHistory, processCountStats, 'Process Counts')}>Process Counts</Button>
                  <Button disabled={disabled} basic fluid onClick={dispatchCommand(channel, selectedApplicationNames, addHistory, processList, 'Process List')}>Process List</Button>

                  <Button basic color='red' fluid onClick={() => confirmDeletion(clearData)}>Clear Charts</Button>
                  <Button basic color='red' fluid onClick={() => confirmDeletion(clearPlainTextLogs)}>Clear Text Data</Button>
                </div>
              </div>
            )
          }
          </CommandHistoryStateContext.Consumer>
        )
      }
    </CollectorStateContext.Consumer>
  )
}
