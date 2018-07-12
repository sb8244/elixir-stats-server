import React from 'react'
import groupBy from 'lodash/groupBy'

import { CollectorStateContext } from './CollectorState'
import { CommandHistoryStateContext } from './CommandHistoryState'

function groupStatsByCommandId(eventList) {
  const statsEvents = eventList.filter(({ type }) => type === 'stats')
  return groupBy(statsEvents, "commandId")
}

function appGrouping(appGroup, getCommandTitle) {
  const commandGrouped = groupStatsByCommandId(appGroup)

  return (
    <div>
      {
        Object.keys(commandGrouped).map((commandId) => (
          <div key={commandId}>
            <h3>{commandId} - {getCommandTitle(commandId)}</h3>
            <div className="server-stats-list">
              {serverStatsGroup(commandGrouped[commandId])}
            </div>
          </div>
        ))
      }
    </div>
  )
}

function serverStatsGroup(statsArr) {
  return statsArr.map(({ collectedAt, commandId, serverId, stats }) => (
    <div className="server-stats-list__entry" key={`${commandId}-${serverId}`}>
      <div>{serverId}</div>
      {
        stats.map(({ label, value }) => (
          <div key={label}>
            <strong>{label}:&nbsp;</strong>
            <span>{value}</span>
          </div>
        ))
      }
    </div>
  ))
}

export default () => (
  <CommandHistoryStateContext.Consumer>
  {
    ({ getTitle }) => (
      <CollectorStateContext.Consumer>
      {
        (collected) => (
          Object.keys(collected).map((appName) => (
            <div key={appName}>
              <h2>{appName}</h2>

              {appGrouping(collected[appName], getTitle)}
            </div>
          ))
        )
      }
      </CollectorStateContext.Consumer>
    )
  }
  </CommandHistoryStateContext.Consumer>
)
