import React, { Component } from 'react'

const renderLogs = ({ getColor, serverId, logs }) => {
  if (!logs) {
    return null
  }

  return (
    <div>
      <h3>
        <span className="color-legend-block" style={{background: getColor(serverId)}} title={serverId} />
        <span>{serverId}</span>
      </h3>
      <div>
      {
        logs.map(({ collectedAtMs, text }) => (
          <div key={`${serverId}-${collectedAtMs}`}>
            <pre>
            {text}
            </pre>
          </div>
        ))
      }
      </div>
    </div>
  )
}

export default class TextsContainer extends Component {
  state = {
    selectedServer: null
  }

  render() {
    const { getColor, plainTextLogs } = this.props
    const selectedServer = this.state.selectedServer || Object.keys(plainTextLogs)[0]
    const displayLogs = plainTextLogs[selectedServer]

    return (
      <div className="texts-container">
        <div className="server-tabs">
        {
          Object.keys(plainTextLogs).sort().map((serverId) => (
            <button key={serverId} onClick={() => this.setState({ selectedServer: serverId })}>{serverId}</button>
          ))
        }
        </div>
        <div>
          { renderLogs({ getColor, serverId: selectedServer, logs: displayLogs }) }
        </div>
      </div>
    )
  }
}
