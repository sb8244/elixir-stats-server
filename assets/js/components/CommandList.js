import React from 'react'
import { Button } from 'semantic-ui-react'

import { CommandHistoryStateContext } from './CommandHistoryState'
import { CollectorStateContext } from './CollectorState'
import { ServerListStateContext } from './ServerListState'
import { allSystemStats, processCountStats, processList } from '../commands'

function dispatchCommand(channel, selectedApplicationNames, selectedServerIds, addHistory, commandGenerator, commandTitle) {
  return () => {
    selectedApplicationNames.forEach((applicationName) => {
      const command = Object.assign({
        application_name: applicationName,
        server_ids: selectedServerIds
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
    <ServerListStateContext.Consumer>
    {
      ({ selectedServerIds }) => (
        <CollectorStateContext.Consumer>
          {
            ({ clearData, clearPlainTextLogs }) => (
              <CommandHistoryStateContext.Consumer>
              {
                ({ addHistory }) => (
                  <div className="command-list-wrapper">
                    <div className="command-list">
                      <Button disabled={disabled} basic fluid onClick={dispatchCommand(channel, selectedApplicationNames, selectedServerIds,  addHistory, allSystemStats, 'Server Stats')}>Server Stats</Button>
                      <Button disabled={disabled} basic fluid onClick={dispatchCommand(channel, selectedApplicationNames, selectedServerIds, addHistory, processCountStats, 'Process Counts')}>Process Counts</Button>
                      <Button disabled={disabled} basic fluid onClick={dispatchCommand(channel, selectedApplicationNames, selectedServerIds, addHistory, processList, 'Process List')}>Process List</Button>

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
    </ServerListStateContext.Consumer>
  )
}
