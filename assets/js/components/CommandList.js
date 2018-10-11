import React from 'react'
import { Button } from 'semantic-ui-react'

import { CommandHistoryStateContext } from './CommandHistoryState'
import { CommandArgumentStateContext } from './CommandArgumentState'
import { CollectorStateContext } from './CollectorState'
import { ServerListStateContext } from './ServerListState'
import { allSystemStats, processList } from '../commands'
import { CHART_TAB, TEXTS_TAB } from './Collector'
import { clearCredentials } from '../credentials'

import observer from './observer'
import { CommandArguments } from './CommandArguments';

function clearCredentialsAndReload() {
  clearCredentials()
  window.location.reload()
}

function dispatchCommand(channel, selectedApplicationNames, selectedServerIds, addHistory) {
  return (commandGenerator, commandTitle, execFn, argList) => () => {
    selectedApplicationNames.forEach((applicationName) => {
      const command = Object.assign({
        application_name: applicationName,
        server_ids: selectedServerIds
      }, commandGenerator(argList))

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
  <CommandArgumentStateContext.Consumer>
  {
    ({ argumentMap, showArguments, toggleShowArguments, setArguments }) => (
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
                          <Button disabled={disabled} basic fluid onClick={dispatch(allSystemStats, 'Server Stats', changeCollectorTab(CHART_TAB), [])}>Server Stats</Button>

                          <div>
                            <div style={{ display: 'flex', marginBottom: '5px' }}>
                              <Button style={{ flexGrow: 1 }} disabled={disabled} basic onClick={dispatch(processList, 'Process List', changeCollectorTab(TEXTS_TAB), argumentMap['processList'])}>Process List</Button>
                              <Button disabled={disabled} basic onClick={() => toggleShowArguments('processList')}>Args</Button>
                            </div>
                            {
                              showArguments['processList'] ?
                                <CommandArguments argumentList={argumentMap['processList']} setArguments={setArguments('processList')} /> :
                                null
                            }
                          </div>

                          <Button basic color='red' fluid onClick={() => confirmDeletion(clearData)}>Clear Charts</Button>
                          <Button basic color='red' fluid onClick={() => confirmDeletion(clearPlainTextLogs)}>Clear Text Data</Button>
                          <Button basic color='red' fluid onClick={() => confirmDeletion(clearCredentialsAndReload)}>Clear Credentials</Button>
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
  }
  </CommandArgumentStateContext.Consumer>
)
