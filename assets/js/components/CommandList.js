import React from 'react'

import { allSystemStats } from '../commands'

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
  </div>
)
