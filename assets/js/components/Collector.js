import React from 'react'
import groupBy from 'lodash/groupBy'

import { CollectorStateContext } from './CollectorState'

function groupStatsByCommandId(eventList) {
  const statsEvents = eventList.filter(({ type }) => type === 'stats')
  return groupBy(statsEvents, "commandId")
}

export default () => (
  <CollectorStateContext.Consumer>
  {
    (collected) => (
      Object.keys(collected).map((appName) => (
        <div key={appName}>
          <h3>{appName}</h3>
          <div>
            {JSON.stringify(groupStatsByCommandId(collected[appName]))}
          </div>
        </div>
      ))
    )
  }
  </CollectorStateContext.Consumer>
)
