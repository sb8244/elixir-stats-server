import React, { Component } from 'react'
import { Menu } from 'semantic-ui-react'

const renderLogs = ({ serverId, logs }) => {
  if (!logs) {
    return null
  }

  return logs.map(({ collectedAtMs, text }) => (
    <div key={`${serverId}-${collectedAtMs}`}>
      <pre>
      {text}
      </pre>
    </div>
  ))
}

export default class TextsContainer extends Component {
  state = {
    selectedServer: null
  }

  render() {
    const { getColor, plainTextLogs } = this.props
    const sortedServerIds = Object.keys(plainTextLogs).sort()
    const selectedServer = this.state.selectedServer || sortedServerIds[0]
    const displayLogs = plainTextLogs[selectedServer]

    return (
      <div className="texts-container">
        <Menu>
        {
          sortedServerIds.map((serverId) => (
            <Menu.Item
              key={serverId}
              name={serverId}
              active={selectedServer === serverId}
              onClick={() => this.setState({ selectedServer: serverId })}
            >
              <span className="color-legend-block" style={{background: getColor(serverId)}} title={serverId} />
              {serverId}
            </Menu.Item>
          ))
        }
        </Menu>
        <div>
          { renderLogs({ serverId: selectedServer, logs: displayLogs }) }
        </div>
      </div>
    )
  }
}
