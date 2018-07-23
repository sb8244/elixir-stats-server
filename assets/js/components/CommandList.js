import React from 'react'
import { Button } from 'semantic-ui-react'

import { CommandHistoryStateContext } from './CommandHistoryState'
import { CollectorStateContext } from './CollectorState'
import { ServerListStateContext } from './ServerListState'
import { allSystemStats, processCountStats, processList } from '../commands'
import { CHART_TAB, TEXTS_TAB } from './Collector'

import observer from './observer'

function dispatchCommand(channel, selectedApplicationNames, selectedServerIds, addHistory) {
  return (commandGenerator, commandTitle, execFn) => () => {
    selectedApplicationNames.forEach((applicationName) => {
      const command = Object.assign({
        application_name: applicationName,
        server_ids: selectedServerIds
      }, commandGenerator())

      channel.push("dispatch_command", command)
      addHistory({ commandId: command.command_id, commandTitle })
      execFn()
    })
  }
}

function confirmDeletion(doDelete) {
  if (window.confirm('Are you sure you wish to clear this data?')) {
    doDelete()
  }
}

function changeCollectorTab(tab) {
  return () => observer.publish('collectorTabChange', tab)
}

export default ({ channel, selectedApplicationNames }) => (
  <ServerListStateContext.Consumer>
  {
    ({ selectedServerIds }) => (
      <CollectorStateContext.Consumer>
        {
          ({ clearData, clearPlainTextLogs }) => (
            <CommandHistoryStateContext.Consumer>
            {
              ({ addHistory }) => {
                const disabled = selectedApplicationNames.length === 0
                const dispatch = dispatchCommand(channel, selectedApplicationNames, selectedServerIds, addHistory)

                return (
                  <div className="command-list-wrapper">
                    <div className="command-list">
                      <Button disabled={disabled} basic fluid onClick={dispatch(allSystemStats, 'Server Stats', changeCollectorTab(CHART_TAB))}>Server Stats</Button>
                      <Button disabled={disabled} basic fluid onClick={dispatch(processCountStats, 'Process Counts', changeCollectorTab(CHART_TAB))}>Process Counts</Button>
                      <Button disabled={disabled} basic fluid onClick={dispatch(processList, 'Process List', changeCollectorTab(TEXTS_TAB))}>Process List</Button>

                      <Button basic color='red' fluid onClick={() => confirmDeletion(clearData)}>Clear Charts</Button>
                      <Button basic color='red' fluid onClick={() => confirmDeletion(clearPlainTextLogs)}>Clear Text Data</Button>
                    </div>
                  </div>
                )
              }
            }
            </CommandHistoryStateContext.Consumer>
          )
        }
      </CollectorStateContext.Consumer>
    )
  }
  </ServerListStateContext.Consumer>
)
