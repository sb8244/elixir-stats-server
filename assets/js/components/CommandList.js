import React from 'react'

import { allSystemStats, processCountStats } from '../commands'

function dispatchCommand(channel, selectedApplicationNames, commandGenerator) {
  return () => {
    selectedApplicationNames.forEach((applicationName) => (
      channel.push("dispatch_command", Object.assign({
        application_name: applicationName
      }, commandGenerator()))
    ))
  }
}

export default ({ channel, selectedApplicationNames }) => (
  <div>
    <button onClick={dispatchCommand(channel, selectedApplicationNames, allSystemStats)}>Server Stats</button>
    <button onClick={dispatchCommand(channel, selectedApplicationNames, processCountStats)}>Process Counts</button>
  </div>
)
